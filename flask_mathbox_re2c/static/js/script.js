const parseInput = document.getElementById('parseInput');
const parseOutput = document.getElementById('parseOutput');

parseInput.addEventListener('input', function() {
    const inputString = parseInput.value;
    const result = parse_u32(inputString + "\0"); // Add null terminator

    if (result === null) {
        parseOutput.textContent = "Output: null";
    } else {
        parseOutput.textContent = "Output: " + result;
    }
});
