var indentKeywords = ['Sub', 'Function', 'If', 'For', 'Do', 'Select']; // Keywords to add indents
var dedentKeywords = ['End', 'Next', 'Loop']; // Keywords to subtract indents
var specialKeywords = ['Else', 'ElseIf']; //Since you dedent only these words & re-indent the following line
var numSpaces = 0; // Initialize number of spaces

document.getElementById('formatButton').addEventListener('click', function () {
    var inputCode = document.getElementById('inputTextArea').value;
    var formattedCode = formatVBA(inputCode);
    document.getElementById('outputTextArea').value = formattedCode;
});

function formatVBA(code) {
    // Split the input code into lines
    var lines = code.split('\n');
    var formattedLines = [];
    var numSpaces = 0;

    // Iterate through each line
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim(); // Trim leading and trailing whitespaces
        let keywordMatch = false;

        // Remove leading spaces from each line
        line = line.trimLeft();

        // Check for indent keywords
        for (var j = 0; j < indentKeywords.length; j++) {
            var keyword = indentKeywords[j];
            if (line.startsWith(keyword)) {
                // Add indentation based on the number of spaces
                line = ' '.repeat(numSpaces) + line;
                numSpaces += 4; // Increment by 4
                keywordMatch = true;
                break;
            }
        }

        // Check for dedent keywords
        for (var k = 0; k < dedentKeywords.length; k++) {
            var dedentKeyword = dedentKeywords[k];
            if (line.startsWith(dedentKeyword)) {
                // Subtract indentation based on the number of spaces
                if (numSpaces >= 4) {
                    numSpaces -= 4; // Decrement by 4
                } else {
                    numSpaces = 0;
                }
                line = ' '.repeat(numSpaces) + line;
                keywordMatch = true;
                break;
            }
        }

        // Check for special case keywords
        for (var p = 0; p < dedentKeywords.length; p++) {
            var specialKeyword = specialKeywords[p];
            if (line.startsWith(specialKeyword)) {
                // Subtract indentation based on the number of spaces
                if (numSpaces >= 4) {
                    numSpaces -= 4; // Decrement by 4
                } else {
                    numSpaces = 0;
                }

                line = ' '.repeat(numSpaces) + line;
                numSpaces += 4;
                keywordMatch = true;
                break;
            }
        }

        if (keywordMatch != true) {
            line = ' '.repeat(numSpaces) + line;
        }

        formattedLines.push(line);
    }

    // Join the formatted lines back into a single string
    return formattedLines.join('\n');
}