import { getSentimentAnalysis } from './formHandler'

/* test if sentiment analysis works with a valid url */
test('Article can be analysed (https://edition.cnn.com/2019/12/13/politics/michelle-obama-greta-thunberg-trump/index.html)', () => {
    const route = 'http://localhost:8081/sentiment'
    const testURL = 'https://edition.cnn.com/2019/12/13/politics/michelle-obama-greta-thunberg-trump/index.html'
    getSentimentAnalysis(route, { url: testURL })
        .then(function (analysis) {
            expect(analysis.status).toBe('OK')
        })

});

/* test case for a semantically valid url, but no article */
test('Semantically valid url but no article (https://edition.cnn.com/2019/12/13/politics/michelle-obama-greta-thunberg-trump/index2.html) is an valid url', () => {
    const route = 'http://localhost:8081/sentiment'
    const testURL = 'https://edition.cnn.com/2019/12/13/politics/michelle-obama-greta-thunberg-trump/index2.html'
    getSentimentAnalysis(route, { url: testURL })
        .then(function (analysis) {
            expect(analysis.status).toBe('server error: e.g. no article found')
        })

});

/* test case for invalid url */
test('Invalid url (euronews)', () => {
    const route = 'http://localhost:8081/sentiment'
    const testURL = 'euronews'
    getSentimentAnalysis(route, { url: testURL })
        .then(function (analysis) {
            expect(analysis.status).toBe('invalid url')
        })

});