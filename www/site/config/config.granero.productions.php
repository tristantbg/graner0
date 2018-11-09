<?php

@include __DIR__ . DS . 'licence.php';
@include __DIR__ . DS . 'cloudinary.php';
@include __DIR__ . DS . 'config.common.php';

c::set('ssl', true);
c::set('cache', false);
c::set('cache.driver', 'memcached');
c::set('thumb.quality', 100);
c::set('thumbs.driver', 'im');
