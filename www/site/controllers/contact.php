<?php

return function ($site, $pages, $page) {

	return array(
		'ptemplate' => $page->intendedTemplate(),
		'menuPosition' => 'top',
	);
}

?>
