import { validURL } from './urlChecker'

// test case 1 to check if url is valid (http and www)
test('https://www.euronews.com is a valid url', () => {
    expect(validURL('https://www.euronews.com')).toBe(true);
});

// test case 2 to check if url is valid (only www, no http)
test('www.euronews.com is a valid url', () => {
    expect(validURL('www.euronews.com')).toBe(true);
});

// test case 3 to check if url is valid (http and no www)
test('https://www.euronews.com is a valid url', () => {
    expect(validURL('https://euronews.com')).toBe(true);
});

// test case to check if url is invalid: just one word
test('euronews is a valid url', () => {
    expect(validURL('euronews')).toBe(false);
});