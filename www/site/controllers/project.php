<?php

return function ($site, $pages, $page) {

	return array(
		'ptemplate' => $page->intendedTemplate(),
		'menuPosition' => 'bottom',
		'medias' => $page->medias()->toStructure(),
    'projects' => $page->parent()->children()->visible()
	);
}

?>
