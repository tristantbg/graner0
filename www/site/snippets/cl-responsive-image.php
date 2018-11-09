<?php if($image = $field->toFile()): ?>

  <div class="responsive-image<?php e(isset($placeholder) && $placeholder, ' with-placeholder') ?>">
    <?php
    if(!isset($maxWidth)) $maxWidth = 3400;
    if (isset($ratio)) {
      if (isset($placeholder) && $placeholder) $dataUriImage = $image->crop(10, intval(10/$ratio))->dataUri();
      $src = $image->cloudinary_url(['width' => 340, 'height' => intval(340/$ratio), 'crop' => 'fill', 'gravity' => 'auto']);
      $srcset = $image->cloudinary_url(['width' => 340, 'height' => intval(340/$ratio), 'crop' => 'fill', 'gravity' => 'auto']) . ' 340w,';
      for ($i = 680; $i <= $maxWidth; $i += 340) $srcset .= $image->cloudinary_url(['width' => $i, 'height' => intval($i/$ratio), 'crop' => 'fill', 'gravity' => 'auto']) . ' ' . $i . 'w,';
    } else {
      if (isset($placeholder) && $placeholder) $dataUriImage = $image->width(10)->dataUri();
      $src = $image->cloudinary_url(['width' => 340]);
      $srcset = $image->cloudinary_url(['width' => 340]) . ' 340w,';
      for ($i = 680; $i <= $maxWidth; $i += 340) $srcset .= $image->cloudinary_url(['width' => $i]) . ' ' . $i . 'w,';
    }
    ?>
    <?php if (!isset($placeholder) || !$placeholder): ?>
        <?php if (isset($ratio)): ?>
        <div class="ph" style="padding-bottom: <?= number_format(100 / $ratio, 5, '.', '') ?>%"></div>
        <?php else: ?>
        <div class="ph" style="padding-bottom: <?= number_format(100 / $image->ratio(), 5, '.', '') ?>%"></div>
        <?php endif ?>
    <?php endif ?>
    <img
    <?php if (isset($preload) && !$preload): ?>
    class="lazy lazyload"
      <?php else: ?>
      class="lazy lazyload lazypreload"
    <?php endif ?>
    <?php if (isset($placeholder) && $placeholder): ?>
    src="<?= $dataUriImage ?>"
    <?php endif ?>
    data-src="<?= $src ?>"
    data-srcset="<?= $srcset ?>"
    data-sizes="auto"
    data-optimumx="1.5"
    <?php if (isset($caption) && $caption): ?>
    alt="<?= $caption.' - © '.$site->title()->html() ?>"
    <?php elseif ($image->caption()->isNotEmpty()): ?>
    alt="<?= $image->caption().' - © '.$site->title()->html() ?>"
    <?php else: ?>
    alt="<?= $page->title()->html().' - © '.$site->title()->html() ?>"
    <?php endif ?>
    width="100%" height="auto" />
    <noscript>
      <img src="<?= $src ?>"
      <?php if (isset($caption) && $caption): ?>
      alt="<?= $caption.' - © '.$site->title()->html() ?>"
      <?php elseif ($image->caption()->isNotEmpty()): ?>
      alt="<?= $image->caption().' - © '.$site->title()->html() ?>"
      <?php else: ?>
      alt="<?= $page->title()->html().' - © '.$site->title()->html() ?>"
      <?php endif ?>
      width="100%" height="auto" />
    </noscript>
    <?php if (isset($withCaption) && $image->caption()->isNotEmpty()): ?>
      <div class="row caption"><?= $image->caption()->kt() ?></div>
    <?php endif ?>
  </div>

<?php endif ?>
