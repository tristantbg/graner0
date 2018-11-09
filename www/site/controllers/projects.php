<?php

return function ($site, $pages, $page) {
	$projects = $page->children()->visible();

	if (param('type')) {
		$projects = $projects->filterBy('category', 'categories/'.param('type'), ',');
	}

	return array(
		'ptemplate' => $page->intendedTemplate(),
		'menuPosition' => 'bottom',
		'projects' => $projects,
	);
}

?>
