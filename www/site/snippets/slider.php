<?php foreach ($medias as $key => $image): ?>

  <?php if($file = $image->toFile()): ?>

    <div class="slide"
    data-caption="<?= $file->caption()->kt()->escape() ?>"
    data-color="<?= $file->mainColor() ?>"
    data-type="<?= e($file->videofile()->isNotEmpty() && $video = $file->videofile()->toFile(), 'video', 'image') ?>"
    >
      <?php if ($file->videofile()->isNotEmpty() && $video = $file->videofile()->toFile()): ?>
      <div class="content video contain">
        <?= $video->cloudinary_tag(['preload' => 'none', 'muted' => true, 'loop' => true]) ?>
      </div>
      <?php else: ?>
      <div class="content image contain">
        <?php
        $file = $image->toFile();
        $srcset = '';
        $dataUriImage = $file->width(10)->dataUri();
        $src = $file->cloudinary_url(['width' => 340]);
        $srcset = $file->cloudinary_url(['width' => 340]) . ' 340w,';
        for ($i = 680; $i <= 3400; $i += 340) $srcset .= $file->cloudinary_url(['width' => $i]) . ' ' . $i . 'w,';
        ?>
        <img
        class="media lazy lazyload"
        src="<?= $dataUriImage ?>"
        data-srcset="<?= $srcset ?>"
        data-sizes="auto"
        data-optimumx="1.5"
        height="100%"
        width="auto"
        alt="<?= $file->page()->title()->html().' - © '.$site->title()->html() ?>" height="100%" width="auto" />
            <noscript>
              <img
              src="<?= $src ?>"
              alt="<?= $file->page()->title()->html().' - © '.$site->title()->html() ?>"
              height="100%"
              width="auto" />
            </noscript>
      </div>
      <?php endif ?>

    </div>

  <?php endif ?>

<?php endforeach ?>

<!-- <div class="slider-footer">
	<div class="slide-number"></div>
	<div class="caption"></div>
</div> -->
