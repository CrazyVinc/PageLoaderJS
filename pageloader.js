// This code runs when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {

    // Check if the browser supports HTML5 history API
    function supportHtmlHist() {
        // Check if window.history and history.pushState are available
        if (window.history && history.pushState) {
            // If yes, execute the h5hapi function
            h5hapi();
        }
        // Return a boolean indicating if HTML5 history API is supported
        return !!(window.history && history.pushState);
    };

    // Main function to handle HTML5 history and AJAX requests
    function h5hapi() {
        // Define variables for the links to be handled, the dynamic content area, and the dynamic content element
        var Links = "a";
        var dynamic = "#maincontent";
        var dynamic_el = document.querySelector(dynamic);

        // Function to update the content based on the URL
        function updateContent(loc) {
            // Create a new XMLHttpRequest object
            var xhr = new XMLHttpRequest();
            // Open a GET request with the given URL
            xhr.open('GET', loc);
            // When the request loads
            xhr.onload = function () {
                // If the request was successful
                if (xhr.status === 200) {
                    // Get the response text and create a temporary element to hold it
                    var data = xhr.responseText;
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = data;
                    // Find the dynamic content in the response and extract its children
                    var dynamic_content = tempElement.querySelector(dynamic).children;
                    // Clear the existing dynamic content
                    dynamic_el.innerHTML = '';
                    // Append the new dynamic content to the dynamic content element
                    for (var i = 0; i < dynamic_content.length; i++) {
                        dynamic_el.appendChild(dynamic_content[i].cloneNode(true));
                    }
                    // Scroll to the top of the page and update the document title
                    window.scrollTo(0, 0);
                    document.title = tempElement.querySelector('title').textContent;
                } else {
                    // If the request was not successful, display the response text and update the document title
                    dynamic_el.innerHTML = xhr.responseText;
                    document.title = xhr.responseText.querySelector('title').textContent;
                }
                // Check if the browser supports HTML5 history API after the content is updated
                supportHtmlHist();
            };
            // When the request fails, log an error message
            xhr.onerror = function () {
                console.error('Request failed');
            };
            // Send the request
            xhr.send();
        };

        // Function to handle link clicks and update the content using AJAX and HTML5 history API
        function navigationClickHandler(Links) {
            // Get all links to be handled
            var links = document.querySelectorAll(Links);
            // Loop through the links and add an event listener for clicks
            for (var i = 0; i < links.length; i++) {
                links[i].removeEventListener('click', clickHandler);
                links[i].addEventListener('click', clickHandler);
            }
            // Function to handle link clicks
            function clickHandler(e) {
                // If the link is not a new tab and the hostname matches the current location
                if (!e.ctrlKey && e.currentTarget.hostname === location.hostname) {
                    // Prevent the default link behavior
                    e.preventDefault();
                    // Push the new URL to the browser's history and update the content
                    history.pushState(null, this.title, this.href);
                    updateContent(this.href);
                } else if (e.currentTarget.href) {
                    // If the link is a new tab, open it in a new tab with noreferrer
                    // Prevent the default link behavior
                    e.preventDefault();
                    // Open the link in a new tab with the "_blank" target and the "noopener" attribute
                    window.open(e.currentTarget.href, '_blank', "noopener");
                }
            }
        };

        // Event listener for the browser's back/forward buttons
        window.addEventListener('popstate', function (e) {
            // Prevent the default browser behavior
            e.preventDefault();
            // Update the content based on the current location
            updateContent(document.location);
        });

        // Call the navigationClickHandler function to handle link clicks
        navigationClickHandler(Links);
    };

    // Call the supportHtmlHist function to initiate the functionality
    supportHtmlHist();
});
