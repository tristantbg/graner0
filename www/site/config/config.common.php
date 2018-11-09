<?php

/*

---------------------------------------
Kirby Configuration
---------------------------------------

By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options

*/

s::$fingerprint = function() {
  return '';
};

c::set('alt', ' | © Area Of Work');

c::set('autobuster', true);
c::set('plugin.embed.video.lazyload', true);
c::set('plugin.embed.video.lazyload.btn', 'assets/images/play.png');
c::set('kirbytext.image.figure', false);
c::set('simplemde.replaceTextarea', false);

c::set('plugin.updateid', array(
  	// Auto-update related ID on each module page
	array(
		'pages'  => function () { return site()->index()->filterBy('intendedTemplate', 'modules')->children(); },
		'fields' => 'pageLink'
	),
	array(
		'pages'  => $site,
		'fields' => ['menus', 'legalPage']
	)
));

c::set('simplemde.buttons', array(
  "bold",
  "link",
  "email",
  "pagelink"
));

//Typo
c::set('typography', false);
c::set('typography.ordinal.suffix', false);
c::set('typography.fractions', false);
c::set('typography.dashes.spacing', false);
c::set('typography.hyphenation', false);
//c::set('typography.hyphenation.language', 'fr');
//c::set('typography.hyphenation.minlength', 5);
c::set('typography.hyphenation.headings', false);
c::set('typography.hyphenation.allcaps', false);
c::set('typography.hyphenation.titlecase', false);
//Settings
c::set('sitemap.exclude', array('error'));
c::set('sitemap.important', array('contact'));
c::set('routes', array(
	// array(
	// 	'pattern' => 'info/(:any)',
	// 	'action'  => function($uri,$uid) {
	// 		$page = site()->homePage();
	// 		go($page);
	// 	}
	// 	),
	array(
		'pattern' => 'robots.txt',
		'action' => function () {
			return new Response('User-agent: *
				Disallow: /content/*.txt$
				Disallow: /kirby/
				Disallow: /site/
				Disallow: /*.md$
				Sitemap: ' . u('sitemap.xml'), 'txt');
		}
		)
));
