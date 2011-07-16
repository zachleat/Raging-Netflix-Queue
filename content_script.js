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
            fandango: /fandango\.com\/[\w\d_]*\/movieoverview/,
            reelviews: /reelviews\.net\/php_review_template\.php/
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
            fandango: 'div#info ul li.title',
            reelviews: 'h1#review-title'
        },
        yearSelectors = {
            apple: '#view-showtimes',
            movies: 'ul#movieSpecs',
            yahoomovies: '#mvinfo div.bd ul',
            fandango: 'div#info ul li:nth-child(2)',
            reelviews: 'div#body-text .movie-inset-item'
        },
        strippers = {
            imdb: function(title) {
                var tvSeriesIndex = title.toUpperCase().indexOf('(TV SERIES');

                return tvSeriesIndex > -1 ? title.substr(0, tvSeriesIndex) : title; 
            }
        };

    function findYear(str)
    {
        var year = str.match(/(\d{4})/);
        return year && year.length > 1 ? parseInt(year[1], 10) : '';
    }

    for(var j in titleSelectors) {
        if(titleSelectors.hasOwnProperty(j) && location.href.match(urls[j])) {
            movieTitle = document.querySelector(titleSelectors[j]).textContent;
            if(strippers[j]) {
                movieTitle = strippers[j](movieTitle);
            }
            if(yearSelectors[j]) {
                movieYear = findYear(document.querySelector(yearSelectors[j]).textContent);
            }
            break;
        }
    }

    // Sometimes the title includes the year
    var parseTitle = movieTitle.trim().match(/([^\(]*)(?:\s\([^\)]*(\d{4})[^\)]*\))?$/),
        parseYear = movieTitle.match(/(\d{4})/);

    port.postMessage({
        movieTitle: (parseTitle && parseTitle.length > 1 ? parseTitle[1] : movieTitle)
                        .trim()
                        .replace(/\&/, 'and')
                        // FIXME Netflix has a bug where it won't do quotes inside of a name
                        .replace(/\'/, ''),
        // must be numeric
        movieYear: movieYear || (parseYear && parseYear.length > 1 ? parseInt(parseYear[1], 10) : '')
    });
});
