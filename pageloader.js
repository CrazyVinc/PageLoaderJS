$(function () {
    function supportHtmlHist() {
        if (window.history && history.pushState) h5hapi();
        return !!(window.history && history.pushState);
    };
    function h5hapi() {
        var Links = "a";
        var dynamic = "#maincontent";
        var dynamic_el = $(dynamic);

        function updateContent(loc) {
            $.get(loc, function (data) {
                dynamic_content = $(data).find(dynamic).children();
                console.log()
                dynamic_el.html(dynamic_content);
                window.scrollTo(0, 0);
            }).done(function (data) {
                document.title = $(data).filter('title').text();
            }).fail(function (data) {
                dynamic_content = $(data.responseText).find(dynamic).children();
                dynamic_el.html(dynamic_content);
            }).fail(function (data) {
                document.title = $(data.responseText).filter('title').text();
            }).always(function (data) {
                supportHtmlHist();
            });
        };


        function navigationClickHandler(Links) {
            $(Links).unbind('click');
            $(Links).on('click', function (e) {
                if (!e.ctrlKey && e.currentTarget.hostname == location.hostname) {
                    e.preventDefault();
                    history.pushState(null, this.title, this.href);
                    updateContent(this.href);
                } else if (e.currentTarget.href) {
                    e.preventDefault();
                    console.log(e);
                    window.open(e.currentTarget.href, '_blank', "noopener");
                }
            });
        };

        $(window).on('popstate', function (e) {
            e.preventDefault();
            updateContent(document.location);
        });
        navigationClickHandler(Links);
    };
    supportHtmlHist();
});