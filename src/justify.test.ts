import justify, { wrapLine, fitToWidth } from "./justify";

describe("wrapLine", () => {
    it("should wrap one line", () => {
        let res = wrapLine("123 456 789", 3);
        expect(res).toStrictEqual(["123", "456", "789"]);

        res = wrapLine("123 456 789", 5);
        expect(res).toStrictEqual(["123", "456", "789"]);

        res = wrapLine("123 456 789", 8);
        expect(res).toStrictEqual(["123 456", "789"]);
    });
    it("should return an empty array on an empty string", () => {
        const res = wrapLine("", 5);
        expect(res).toStrictEqual([]);
    });
    it("should break words", () => {
        let res = wrapLine("123456789", 8);
        expect(res).toStrictEqual(["1234567-", "89"]);

        res = wrapLine("123456789", 3);
        expect(res).toStrictEqual(["12-", "34-", "56-", "789"]);
    });
});

describe("fitToWidth", () => {
    it("should not modify a line that already fits", () => {
        let res = fitToWidth("abcdefgh", 4);
        expect(res).toBe("abcdefgh");

        res = fitToWidth("abc def", 7);
        expect(res).toBe("abc def");
    });
    it("should add space between two words", () => {
        let res = fitToWidth("123 456", 10);
        expect(res).toBe("123    456");

        res = fitToWidth("abcde fgh", 12);
        expect(res).toBe("abcde    fgh");
    });
    it("should add space between multiple words", () => {
        let res = fitToWidth("123 456 78", 14);
        expect(res).toBe("123   456   78");

        res = fitToWidth("abcd efg hijk l", 20);
        expect(res).toBe("abcd   efg   hijk  l");
    });
});

describe("justify", () => {
    it("should justify a long text", () => {
        const input = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla felis nisi, consectetur vel justo vel, dapibus lacinia erat. Morbi accumsan tempus mi nec lobortis. Nam lobortis rutrum ligula, at dapibus sem sodales sit amet. Donec a sapien nec magna aliquam pretium. Integer euismod felis sed rhoncus sodales. Sed lacus enim, pellentesque sit amet massa fringilla, vehicula maximus felis. Integer quis diam ut lectus dignissim finibus quis sed turpis. Nullam id eros ut nulla sodales rhoncus. Sed convallis pretium pretium. Ut tincidunt augue sed sodales interdum. Sed neque nunc, venenatis vitae odio non, congue egestas sem. Vivamus ante turpis, ultricies ut ex in, mattis porttitor erat. Quisque pharetra dolor eros, at hendrerit nisl luctus sed. Morbi interdum sagittis placerat. Vivamus id commodo nibh.
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst. Praesent lacinia elit egestas lectus porttitor accumsan. Nulla finibus molestie consequat. Nulla rutrum blandit diam a dignissim. In hac habitasse platea dictumst. Proin rutrum vel mauris sed maximus.
`;
        const result = justify(input, 40);
        for (const line of result.split("\n")) {
            if (line.trim().length) {
                expect(line.length).toBe(40);
                expect(line.charCodeAt(0)).not.toBe(" ");
                expect(line.charCodeAt(39)).not.toBe(" ");
            }
        }
    });
});
