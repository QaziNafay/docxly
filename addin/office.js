// Office.js bridge for the Docxly add-in task pane.
window.docxlyOffice = {
  available: function () {
    return typeof Office !== "undefined";
  },

  // Returns the open document as a base64 .docx (compressed file).
  getDocumentBase64: function () {
    return new Promise(function (resolve, reject) {
      if (typeof Office === "undefined") {
        reject("Office.js is not available. Open this add-in inside Microsoft Word.");
        return;
      }

      Office.context.document.getFileAsync(
        Office.FileType.Compressed,
        { sliceSize: 4194304 },
        function (result) {
          if (result.status !== Office.AsyncResultStatus.Succeeded) {
            reject(result.error.message);
            return;
          }

          var file = result.value;
          var count = file.sliceCount;
          var slices = new Array(count);
          var received = 0;

          function next(index) {
            file.getSliceAsync(index, function (sliceResult) {
              if (sliceResult.status !== Office.AsyncResultStatus.Succeeded) {
                file.closeAsync();
                reject(sliceResult.error.message);
                return;
              }

              slices[index] = sliceResult.value.data;
              received += 1;
              if (received < count) {
                next(received);
                return;
              }

              file.closeAsync(function () {
                var total = 0;
                for (var i = 0; i < slices.length; i++) { total += slices[i].length; }
                var bytes = new Uint8Array(total);
                var offset = 0;
                for (var j = 0; j < slices.length; j++) {
                  bytes.set(slices[j], offset);
                  offset += slices[j].length;
                }

                var binary = "";
                var chunk = 0x8000;
                for (var k = 0; k < bytes.length; k += chunk) {
                  binary += String.fromCharCode.apply(null, bytes.subarray(k, k + chunk));
                }
                resolve(btoa(binary));
              });
            });
          }

          next(0);
        }
      );
    });
  },

  // Bolds the body paragraphs whose text matches the given list, in order.
  boldMatchingParagraphs: function (texts) {
    return Word.run(function (context) {
      var paragraphs = context.document.body.paragraphs;
      paragraphs.load("items/text");
      return context.sync().then(function () {
        function normalize(value) {
          return (value || "").replace(/\s+/g, " ").trim();
        }

        var wanted = texts.map(normalize);
        var used = wanted.map(function () { return false; });
        var count = 0;

        for (var i = 0; i < paragraphs.items.length; i++) {
          var text = normalize(paragraphs.items[i].text);
          if (!text) { continue; }
          for (var w = 0; w < wanted.length; w++) {
            if (!used[w] && wanted[w] === text) {
              paragraphs.items[i].font.bold = true;
              used[w] = true;
              count += 1;
              break;
            }
          }
        }

        return context.sync().then(function () { return count; });
      });
    });
  },
};
