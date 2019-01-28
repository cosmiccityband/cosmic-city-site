$(document).ready(function () {
    var environment = window.location.host === 'cyrus-shahrivar.github.io' ? 'beta' : 'prod';
    var isBeta = environment === 'beta';
    var environmentPathname = isBeta ? '/BAND_WEBSITE/' : '/';

    var sectionPromises = [];

    // Nav Setup
    if (isBeta) {
        $('nav ul li a, .nav-logo-link').each(function(){
            var currentHref = $(this).attr('href');
            $(this).attr('href', '/BAND_WEBSITE' + currentHref);
        });
    }

    // Setup Mobile Menu
    var $body = $('body');
    var $hamburgerOpenButton = $('.hamburger-open-button');
    var $xCloseButton = $('.x-close-button');
    var $navLinks = $('.nav-link');

    $hamburgerOpenButton.click(function () {
        console.log('clicked');
        $body.toggleClass('mobile-menu-open');
    });

    $xCloseButton.click(function () {
        console.log('clicked');
        $body.toggleClass('mobile-menu-open');
    });

    $navLinks.click(function() {
        if ($body.hasClass('mobile-menu-open')) {
            $body.toggleClass('mobile-menu-open');
        }
    })

    // Setup Homepage Sections
    var sections = ['shows', 'videos', 'about', 'contact'];
    var sectionObjects = sections.map(function (section) {
        return {
            sectionName: section,
            $sectionElement: $('.' + section + '-section'),
            sectionTemplate: $('#' + section + '-template').html(),
        }
    });

    sectionObjects.forEach(function (sectionObj) {
        var sectionName = sectionObj.sectionName;
        Handlebars.registerPartial(sectionName + '-template', sectionObj.sectionTemplate);
        sectionObj.compiledTemplate = Handlebars.compile(sectionObj.sectionTemplate);

        $.ajax({
            dataType: 'json',
            url: environmentPathname + 'data/' + sectionName + '.json'
          }).then(
            function(data) {
                data.isBeta = isBeta;
                data.environmentPathname = environmentPathname;
                var compiledHtml =sectionObj.compiledTemplate(data);
                sectionObj.$sectionElement.append(compiledHtml);

                sectionPromises.push(Promise.resolve());

                // Setup for scrolling to section from other pages
                // HACK
                if (sectionPromises.length === sections.length) {
                    Promise.all(sectionPromises).then(function () {
                        console.log('all sections loaded');
                        // HACK, but better than *
                        $('div.logo, section.hero, img, video').on('load', function () {
                            console.log('all visible assets loaded');
                            var sectionId = window.location.hash;

                            if (sectionId) {
                                var $sectionToScrollTo = $(sectionId);

                                $('html, body').scrollTop($sectionToScrollTo.offset().top);
                            }
                        });
                    })
                }
            },
            function (jqXHR, textStatus, errorThrown) {
                console.log('Error', errorThrown);
            }
        );
    });
})
