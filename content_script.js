chrome.extension.onConnect.addListener(function(port)
{
    var movieTitle = '',
        movieYear = '',
        urls = {
            rt: /rottentomatoes\.com\/m\//,
            imdb: /imdb\.com\/title\//,
            google: /google\.com\/movies\?/,
            apple:  /trailers\.apple\.com\/trailers\//,
            moviefone: /moviefone\.com\/movie\//,
            movies: /movies\.com\//,
            yahoomovies: /movies\.yahoo\.com\/movie\/\d*\/video/,
            yahooinfo: /movies\.yahoo\.com\/movie\/\d*\/info/,
            fandango: /fandango\.com\/[\w\d_]*\/movieoverview/
        },
        titleSelectors = {
            rt: 'h1.movie_title',
            imdb: '#overview-top h1.header',
            google: '#movie_results div.desc h2',
            apple: '#hero h1.replaced',
            moviefone: '#movie-nav-title span.item span.fn h1',
            movies: 'div#completeInfo h1',
            yahoomovies: '#bd div.hd h1 em',
            yahooinfo: 'h1',
            fandango: 'div#info ul li.title'
        },
        yearSelectors = {
            apple: '#view-showtimes',
            movies: 'ul#movieSpecs',
            yahoomovies: '#mvinfo div.bd ul',
            fandango: 'div#info ul li:nth-child(2)'
        };

    function findYear(str)
    {
        var year = str.match(/(\d{4})/);
        return year && year.length > 1 ? parseInt(year[1], 10) : '';
    }

    for(var j in titleSelectors) {
        if(titleSelectors.hasOwnProperty(j) && location.href.match(urls[j])) {
            movieTitle = document.querySelector(titleSelectors[j]).textContent;
            if(yearSelectors[j]) {
                movieYear = findYear(document.querySelector(yearSelectors[j]).textContent);
            }
            break;
        }
    }

    // Sometimes the title includes the year
    var parseTitle = movieTitle.trim().match(/([^\(]*)(?:\s\((\d{4})\))?$/);

    port.postMessage({
        movieTitle: (parseTitle && parseTitle.length > 1 ? parseTitle[1] : movieTitle)
                        .trim()
                        .replace(/\&/, 'and')
                        // FIXME Netflix has a bug where it won't do quotes inside of a name
                        .replace(/\'/, ''),
        // must be numeric
        movieYear: movieYear || (parseTitle && parseTitle.length > 2 ? parseInt(parseTitle[2], 10) : '')
    });
});
