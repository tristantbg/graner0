<?php snippet('header') ?>

<div id="landing-slider" class="slider">
  <?php if($file = $page->medias()->toStructure()->shuffle()->first()->toFile()): ?>

    <div class="slide"
    data-caption="<?= $file->caption()->kt()->escape() ?>"
    data-color="<?= $file->mainColor() ?>"
    data-type="<?= e($file->videofile()->isNotEmpty() && $video = $file->videofile()->toFile(), 'video', 'image') ?>"
    >
      <?php if ($file->vimeoID()->isNotEmpty() && $vimeoID = $file->vimeoID()->value()): ?>
        <div class="player-container">
          <div class="video-player" data-plyr-provider="vimeo" data-plyr-embed-id="<?= $vimeoID ?>"></div>
        </div>
      <?php elseif ($file->videofile()->isNotEmpty() && $video = $file->videofile()->toFile()): ?>
      <div class="content video contain">
        <?= $video->cloudinary_tag(['preload' => 'none', 'muted' => true, 'loop' => true]) ?>
      </div>
      <?php else: ?>
      <div class="content image contain">
        <?php
        $srcset = '';
        $src = $file->thumb(['width' => 1020])->url();
        $srcset = $file->thumb(['width' => 340])->url() . ' 340w,';
        for ($i = 680; $i <= 5800; $i += 340) $srcset .= $file->thumb(['width' => $i])->url() . ' ' . $i . 'w,';
        ?>
        <img
        class="media lazy lazyload"
        data-flickity-lazyload="<?= $src ?>"
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
</div>

<?php snippet('footer') ?>
