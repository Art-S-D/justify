/**
 * take a string and split in strings of max size *width*
 * it does so by adding line breaks between words
 * and splits words if they do not fit
 *
 * assumes the line doesn't have extra spaces
 *
 * @param  {string} line the line to wrap
 * @param  {number} width
 * @returns string[]
 */
export function wrapLine(line: string, width: number): string[] {
    const words = line.split(" ").reverse();
    if (words.length === 0) return [];

    const result = [];
    let currentLine = null;

    while (words.length > 0) {
        const word = words.pop()!;

        // here we make sure that the word can fit in *width* characters
        // if not, we split in two
        if (word.length > width) {
            words.push(word.slice(width - 1));
            words.push(word.slice(0, width - 1) + "-");
            continue;
        }

        if (!currentLine) {
            currentLine = word;
            continue;
        }

        if (currentLine.length + word.length + 1 <= width) {
            currentLine = `${currentLine} ${word}`;
        } else {
            result.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine?.length) result.push(currentLine);
    return result;
}

/**
 * take a line and add spaces between words to fit *width* characters
 * assumes the line doesn't have extra spaces
 *
 * @param  {string} line the line to fit
 * @param  {number} width
 * @returns string
 */
export function fitToWidth(line: string, width: number): string {
    const words = line.split(" ");
    if (line.length >= width) return line;
    const missingSpaces = width - line.length;

    for (let i = 0; i < missingSpaces; i++) {
        words[i % (words.length - 1)] += " ";
    }

    return words.join(" ");
}

/**
 * justifies a text
 *
 * @param  {string} input
 * @param  {number=80} width
 * @returns string
 */
export default function justify(input: string, width = 80): string {
    const lines = input.split(/\r?\n/);

    let result = "";

    for (const line of lines) {
        const trimmed = line.replace(/ +/g, " ").trim();
        if (trimmed.length === 0) continue;

        for (const wrappedLine of wrapLine(trimmed, width)) {
            const fitted = fitToWidth(wrappedLine, width);
            result = result.length ? `${result}\n${fitted}` : fitted;
        }
    }
    return result;
}
