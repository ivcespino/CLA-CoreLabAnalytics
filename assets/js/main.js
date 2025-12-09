$(document).ready(function() {

    // --- Global Favicon ---
    $('head').append('<link rel="icon" type="image/png" href="assets/images/logo_dark.png">');
    
    // --- Component Loading ---
    // Load Header
    $("#global-header").load("components/header.html", function() {
        initTheme(); 
        highlightActivePage();

            $('#mobile-menu-btn').on('click', function() {
            $('#mobile-menu').slideToggle(200); // Smooth slide animation
        });
    });

    // Load Footer
    $("#global-footer").load("components/footer.html", function(response, status, xhr) {
        if (status == "error") { console.error("Error loading footer:", xhr.status, xhr.statusText); }
        else {
            $("#current-year").text(new Date().getFullYear());
            
            $("#back-to-top").on("click", function(e) {
                e.preventDefault();
                $("html, body").animate({ scrollTop: 0 }, "slow");
            });
        }
    });

    // --- Functions & Logic ---
    function highlightActivePage() {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if (page === "") page = "index.html";

        $('.nav-link').each(function() {
            var href = $(this).attr('href');
            if (href === page) {
                $(this).addClass('active');
            }
        });
    }

    // Theme Initialization
    function initTheme() {
        const $html = $('html');
        const $toggleBtn = $('#theme-toggle');
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            $html.addClass('dark');
        } else {
            $html.removeClass('dark');
        }

        $toggleBtn.off('click').on('click', function() {
            $html.toggleClass('dark');
            const isDark = $html.hasClass('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            document.dispatchEvent(new CustomEvent('themeChange', { 
                detail: { isDark: isDark } 
            }));
        });
    }

});

