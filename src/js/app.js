/* jshint esversion: 6 */

import 'babel-polyfill'
import lazysizes from 'lazysizes'
import optimumx from 'lazysizes'
require('../../node_modules/lazysizes/plugins/object-fit/ls.object-fit.js')
require('../../node_modules/lazysizes/plugins/unveilhooks/ls.unveilhooks.js')
import Flickity from 'flickity'
import Hammer from 'hammerjs'
import Plyr from 'plyr'
import Hls from 'hls.js'
import throttle from 'lodash.throttle'
// import {
//   TweenMax,
//   AttrPlugin
// } from 'gsap'
import Barba from 'barba.js'
require('viewport-units-buggyfill').init()

const resizeWindow = () => {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
}

const sizeElem = (id, sizeW, sizeH) => {
  const elem = document.getElementById(id)
  if (elem) {
    if (sizeW) elem.style.width = sizeW + 'px'
    if (sizeH) elem.style.height = sizeH + 'px'
  }
}

const placeElem = (id, top, left) => {
  const elem = document.getElementById(id)
  if (elem) {
    if (top) elem.style.top = top + 'px'
    if (left) elem.style.left = left + 'px'
  }
}

const margeElem = (id, top) => {
  const elem = document.getElementById(id)
  if (elem) {
    if (top) elem.style.marginTop = top + 'px'
  }
}

const App = {
  init: () => {
    App.pageType = document.body.getAttribute('page-type');
    App.sizeSet()
    App.preventZoom()
    App.interact.init()
    Players.init()
    Sliders.init()
    // Pjax.init()
    window.addEventListener('resize', throttle(App.sizeSet, 128), false);
    document.getElementById("loader").style.display = "none"

  },
  sizeSet: () => {
    App.width = (window.innerWidth || document.documentElement.clientWidth);
    App.height = (window.innerHeight || document.documentElement.clientHeight);
    if (App.width <= 1080)
      App.isMobile = true;
    if (App.isMobile) {
      if (App.width > 1080) {
        // location.reload();
        App.isMobile = false;
      }
    }
    App.sizeElements();
  },
  sizeElements: () => {

    App.header = document.querySelector('header')
    App.menu = document.getElementById('menu')
    App.contact = document.getElementById('contact')

    // sizeElem('project-medias', null, App.height - (App.header.offsetHeight + App.menu.offsetHeight))
    // placeElem('project-medias', (App.header.offsetHeight + App.menu.offsetHeight), null)

    // if (App.isMobile && App.pageType !== 'about') margeElem('page-content', (App.header.offsetHeight + App.menu.offsetHeight))

  },
  preventZoom: () => {
    var main = document.getElementById('main');
    var hammertime = new Hammer(main, {
      prevent_default: false,
      touchAction: 'pan'
    });
    hammertime.get('pinch').set({
      enable: true
    });
    hammertime.on('pinch pinchend pinchstart doubletap', function(e) {
      e.preventDefault()
    })
  },
  interact: {
    init: () => {
      App.interact.embedKirby()
      App.interact.linkTargets()
    },
    linkTargets: () => {
      const links = document.querySelectorAll("a");
      for (var i = 0; i < links.length; i++) {
        const element = links[i];
        if (element.host !== window.location.host) {
          element.setAttribute('target', '_blank');
        } else {
          element.setAttribute('target', '_self');
        }
      }
    },
    embedKirby: () => {
      var pluginEmbedLoadLazyVideo = function() {
        var wrapper = this.parentNode;
        var embed = wrapper.children[0];
        var script = wrapper.querySelector('script');
        embed.src = script ? script.getAttribute('data-src') + '&autoplay=1' : embed.getAttribute('data-src') + '&autoplay=1';
        wrapper.removeChild(this);
      };

      var thumb = document.getElementsByClassName('embed__thumb');

      for (var i = 0; i < thumb.length; i++) {
        thumb[i].addEventListener('click', pluginEmbedLoadLazyVideo, false);
      }
    },

  },
}

const Players = {
  players: [],
  init: () => {
    // Players.cloudinary = new cloudinary.Cloudinary({
    //   cloud_name: cloudname,
    //   secure: true
    // });
    const videoPlayers = document.getElementsByClassName('video-player')

    const options = {
      controls: [''],
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true
      },
      // iconUrl: _root + "/assets/images/player.svg"
    }

    const optionsSilent = {
      controls: [''],
      autoplay: false,
      muted: true,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true
      },
      // iconUrl: _root + "/assets/images/player.svg"
    }


    // for (var i = 0; i < videoPlayers.length; i++) {
    //   const videoElement = videoPlayers[i]
    //     const player = videoElement
    //     Players.players.push(player)
    //     player.muted = false;
    // }

    for (var i = 0; i < videoPlayers.length; i++) {
      const player = new Plyr(videoPlayers[i], optionsSilent)
      const playerContainer = player.elements.container.closest('.player-container');
      if (playerContainer) {
        player.elements.playerContainer = playerContainer
        playerContainer.dataset.plyr_id = i
      }
      player.muted = true
      Players.players.push({player: player, playerContainer: playerContainer})
      // player.play()
    }

    Players.prepareStream(videoPlayers)
    Players.events()
    Players.accessibility()
    // Players.playInView()

    // window.addEventListener('scroll', throttle(Players.playInView, 128), false);

  },
  events: () => {

    for (var i = 0; i < Players.players.length; i++) {
      const player = Players.players[i].player
      player.on('playing', e => {
        player.elements.playerContainer.classList.add('video-is-playing')
      })
      player.on('pause', e => {
        player.elements.playerContainer.classList.remove('video-is-playing')
      })
    }

  },
  prepareStream: (videos) => {

    if (videos.length < 1) return;

    const attachStream = (videoElement) => {
      if (videoElement.getAttribute('data-stream') && Hls.isSupported()) {
        Players.players[i].hls = new Hls({
          minAutoBitrate: 1700000
        });
        Players.players[i].hls.loadSource(videoElement.getAttribute('data-stream'));
        Players.players[i].hls.attachMedia(videoElement);
      }
    };

    for (var i = 0; i < videos.length; i++) {
      const videoElement = videos[i];
      attachStream(videoElement);
    }
  },
  playInView: () => {
    if (Players.players && document.querySelector('.play-on-scroll')) {
      // if (Players.players) {
      let playPromise;
      Players.players.forEach(player => {
        if (!player.forceStop && player.media.classList.contains('play-on-scroll') && isInViewport(player.media)) {
          if (!player.playing)
            playPromise = player.play();
          if (playPromise !== undefined) {
            playPromise.then(function() {
              if (App.options.forceVideoSound && !player.elements.playerContainer.classList.contains('silent')) {
                Players.unmute(player)
              }
            }).catch(function(error) {
              Players.mute(player)
              player.play()
            });
          }
        } else {
          player.pause();
        }
      });
    }
  },
  pauseAll: () => {
    for (var i = 0; i < Players.players.length; i++) {
      const player = Players.players[i].player;
      player.pause()
    }
  },
  muteAll: () => {
    for (var i = 0; i < Players.players.length; i++) {
      const player = Players.players[i].player;
      player.elements.playerContainer.classList.add('video-is-muted')
      player.muted = true
    }
  },
  unmute: player => {
    if (!Players.forceMute && player.muted) {
      Players.muteAll()
      player.elements.playerContainer.classList.remove('video-is-muted')
      player.muted = false
    }
  },
  mute: player => {
    if (!player.muted) {
      player.elements.playerContainer.classList.add('video-is-muted')
      player.muted = true
    }
  },
  accessibility: () => {
    for (var i = 0; i < Players.players.length; i++) {
      const player = Players.players[i].player;

      const playPause = player.elements.playerContainer.querySelectorAll('[event-target=playpause]')
      const muteBtn = player.elements.playerContainer.querySelector('[event-target=mute]')
      const unmuteBtn = player.elements.playerContainer.querySelector('[event-target=unmute]')
      const fullscreenBtn = player.elements.playerContainer.querySelector('[event-target=fullscreen]')

      if (playPause) {
        for (var j = 0; j < playPause.length; j++) {
          playPause[j].addEventListener('click', () => {
            if (player.playing) {
              player.forceStop = true;
            } else {
              player.forceStop = false;
            }
            player.togglePlay()
          })
        }
      }
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          Players.forceMute = true
          Players.mute(player)
        })
      }
      if (unmuteBtn) {
        unmuteBtn.addEventListener('click', () => {
          Players.forceMute = false
          Players.unmute(player)
        })
      }
      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
          Players.forceMute = false
          player.fullscreen.enter()
          Players.unmute(player)
        })
      }
    }
  }
}

const Sliders = {
  flickitys: [],
  init: () => {
    Sliders.elements = document.getElementsByClassName('slider');
    if (Sliders.elements.length > 0) {
      for (var i = 0; i < Sliders.elements.length; i++) {
        Sliders.flickity(Sliders.elements[i], {
          cellSelector: '.slide',
          imagesLoaded: true,
          lazyLoad: 1,
          cellAlign: 'left',
          setGallerySize: false,
          adaptiveHeight: false,
          wrapAround: true,
          prevNextButtons: !App.isMobile,
          pageDots: false,
          draggable: '>1',
          arrowShape: 'M29.7 77.4l4.8-3.7L10 41.8h90v-6.1H10.1L34.5 4.6 29.7.9 0 38.7z'
        });
      }
      Sliders.accessibility()
    }
  },
  flickity: (element, options) => {
    Sliders.slider = new Flickity(element, options);
    Sliders.flickitys.push(Sliders.slider);
    if (Sliders.slider.slides.length < 1) return; // Stop if no slides

    Sliders.slider.on('change', function() {
      if (this.selectedElement) {
        const caption = this.element.parentNode.querySelector('.caption');
        if (caption)
          caption.innerHTML = this.selectedElement.getAttribute('data-caption');
        const number = this.element.parentNode.querySelector('.slide-number');
        if (number)
          number.innerHTML = (this.selectedIndex + 1) + '/' + this.slides.length;
      Players.pauseAll()
      const video = this.selectedElement.querySelector('video');
      if (video)
        video.play()
      }
      const plyr = Sliders.slider.selectedElement.querySelector('.player-container[data-plyr_id]');
      if (plyr)
        Players.players[plyr.dataset.plyr_id].player.on('ready', () => {
          Players.players[plyr.dataset.plyr_id].player.play()
        })
      const adjCellElems = this.getAdjacentCellElements(1);
      for (let i = 0; i < adjCellElems.length; i++) {
        const adjCellImgs = adjCellElems[i].querySelectorAll('.lazy:not(.lazyloaded):not(.lazyload)')
        for (let j = 0; j < adjCellImgs.length; j++) {
          adjCellImgs[j].classList.add('lazyload')
        }
      }
    });
    Sliders.slider.on('staticClick', function(event, pointer, cellElement, cellIndex) {
      if (!cellElement) {
        return;
      } else {
        this.next();
      }
    });
    if (Sliders.slider.selectedElement) {
      const caption = Sliders.slider.element.querySelector('.caption');
      if (caption)
        caption.innerHTML = Sliders.slider.selectedElement.getAttribute('data-caption');
      const number = Sliders.slider.element.parentNode.querySelector('.slide-number');
      if (number)
        number.innerHTML = (Sliders.slider.selectedIndex + 1) + '/' + Sliders.slider.slides.length;

      const video = Sliders.slider.selectedElement.querySelector('video');
      if (video)
        video.play()

      const plyr = Sliders.slider.selectedElement.querySelector('.player-container[data-plyr_id]');
      if (plyr)
        Players.players[plyr.dataset.plyr_id].player.on('ready', () => {
          Players.players[plyr.dataset.plyr_id].player.play()
        })
    }
  },
  accessibility: () => {
    const prevNext = document.getElementsByClassName('flickity-prev-next-button')

    for (var i = 0; i < prevNext.length; i++) {
      const elem = prevNext[i]
      elem.addEventListener('mousemove', event => {
        var svg = elem.querySelector("svg");
        var parentOffset = elem.getBoundingClientRect();
        svg.style.top = event.pageY - parentOffset.top - pageYOffset + "px";
        svg.style.left = event.pageX - parentOffset.left + "px";

      })
    }

  }
}

const Pjax = {
  titleTransition: 0.7,
  init: function() {
    Barba.Pjax.getTransition = function() {
      return Pjax.hideShowTransition
    };
    Barba.Dispatcher.on('linkClicked', function(el) {
      App.linkClicked = el
    });
    Barba.Pjax.Dom.wrapperId = 'main'
    Barba.Pjax.Dom.containerClass = 'pjax'
    Barba.BaseCache.reset()
    // Barba.Pjax.cacheEnabled = false;
    Barba.Pjax.start()
  },
  hideShowTransition: Barba.BaseTransition.extend({
    start: function() {
      let _this = this
      _this.newContainerLoading.then(_this.startTransition.bind(_this))
    },
    startTransition: function() {
      document.body.classList.add('is-loading')

      let _this = this
      const newContent = _this.newContainer.querySelector('#page-content')

      // const currentLink = document.querySelector('a.active')
      // if (currentLink) currentLink.classList.remove('active')
      // if (App.linkClicked) App.linkClicked.classList.add('active')

      App.nextPageType = newContent.getAttribute('page-type')
      App.menuPosition = newContent.getAttribute('data-menu')
      App.filtering = newContent.getAttribute('data-filter')

      if (true || App.isMobile || App.nextPageType == 'contact' || App.nextPageType == 'home') _this.newContainer.querySelector('#menu').classList.remove('visible')
      if (true || App.isMobile) _this.oldContainer.querySelector('#menu').classList.remove('visible')

      if (App.pageType == 'about') {
        if (App.nextPageType == 'projects') _this.newContainer.querySelector('#menu').classList.remove('visible')
        new TimelineMax({
          onComplete: () => {
            _this.endTransition(_this, newContent)
          }
        }).to(_this.oldContainer.querySelector('#page-content'), 1.3, {
          y: App.isMobile ? '100%' : App.height,
          ease: Expo.easeInOut
        }).to(_this.oldContainer.querySelector('#menu'), 0.2, {
          classList: '-=visible'
        }, '-=0.7').to(document.body, Pjax.titleTransition, {
          attr: {
            'page-type': App.nextPageType
          }
        }).to(document.body, 0, {
          attr: {
            'data-menu': App.menuPosition,
          }
        }, '-=0.1')
      } else if (App.pageType == 'projects') {
        if (App.nextPageType !== 'projects' && App.nextPageType !== 'project') {

          _this.newContainer.querySelector('#menu').classList.remove('visible')
          new TimelineMax({
            onComplete: () => {
              _this.endTransition(_this, newContent)
            }
          }).to(_this.oldContainer.querySelector('#page-content'), 0.3, {
            y: 50,
            force3D: true,
            opacity: 0
          }).to(_this.oldContainer.querySelector('#menu'), 0.2, {
            classList: '-=visible'
          }).to(document.body, Pjax.titleTransition, {
            attr: {
              'page-type': App.nextPageType,
              'data-menu': App.menuPosition,
            }
          })

        } else {
          new TimelineMax({
            onComplete: () => {
              document.body.setAttribute('page-type', App.nextPageType)
              document.body.setAttribute('data-menu', App.menuPosition)
              setTimeout(function() {
                _this.endTransition(_this, newContent)
              }, Pjax.titleTransition * 1000)
            }
          }).to(_this.oldContainer.querySelector('#page-content'), 0.3, {
            y: 50,
            force3D: true,
            opacity: 0
          })

        }
      } else if (App.pageType == 'project' && App.nextPageType == 'projects' || App.pageType == 'project' && App.nextPageType == 'project') {
        new TimelineMax({
          onComplete: () => {
            document.body.setAttribute('page-type', App.nextPageType)
            document.body.setAttribute('data-menu', App.menuPosition)
            setTimeout(function() {
              _this.endTransition(_this, newContent)
            }, Pjax.titleTransition * 1000)
          }
        }).to(_this.oldContainer.querySelector('#page-content'), 0.3, {
          y: 50,
          force3D: true,
          opacity: 0
        })
      } else if (App.pageType == 'project') {
        _this.newContainer.querySelector('#menu').classList.remove('visible')
        new TimelineMax({
          onComplete: () => {
            document.body.setAttribute('page-type', App.nextPageType)
            document.body.setAttribute('data-menu', App.menuPosition)
            setTimeout(function() {
              _this.endTransition(_this, newContent)
            }, Pjax.titleTransition * 1000)
          }
        }).to(_this.oldContainer.querySelector('#page-content'), 0.3, {
          y: 50,
          force3D: true,
          opacity: 0
        }).to(_this.oldContainer.querySelector('#menu'), 0.2, {
          classList: '-=visible'
        })
      } else if (App.pageType == 'contact') {
        _this.newContainer.querySelector('#menu').classList.remove('visible')
        new TimelineMax({
          onComplete: () => {
            _this.endTransition(_this, newContent)
          }
        }).to(_this.oldContainer.querySelector('#menu'), 0.2, {
          classList: '-=visible'
        }).to(document.body, Pjax.titleTransition, {
          attr: {
            'page-type': App.nextPageType,
            'data-menu': App.menuPosition,
          }
        })
      } else if (App.pageType == 'home') {
        _this.newContainer.querySelector('#menu').classList.remove('visible')
        new TimelineMax({
          onComplete: () => {
            _this.endTransition(_this, newContent)
          }
        }).to(_this.oldContainer.querySelector('#menu'), 0.2, {
          classList: '-=visible'
        }).to(document.body, Pjax.titleTransition, {
          attr: {
            'page-type': App.nextPageType,
            'data-menu': App.menuPosition
          }
        })
      } else {
        document.body.setAttribute('page-type', App.nextPageType)
        document.body.setAttribute('data-menu', App.menuPosition)
        _this.endTransition(_this, newContent)
      }

    },
    endTransition: function(_this, newContent) {
      window.scroll(0, 0)
      resizeWindow()
      if (App.nextPageType == 'projects') {
        TweenMax.set(_this.newContainer.querySelector('#page-content'), {
          y: 50,
          force3D: true,
          opacity: 0
        })
        _this.finish(_this, newContent)
        setTimeout(function() {
          new TimelineMax({
            onComplete: () => {
              TweenMax.set(document.querySelector('#page-content'), {
                clearProps: 'transform,opacity'
              })
            }
          }).fromTo(_this.newContainer.querySelector('#page-content'), 0.3, {
            y: 50,
            opacity: 0
          }, {
            y: 0,
            force3D: true,
            opacity: 1
          });
        }, 500);
      }
      if (App.nextPageType == 'project') {
        TweenMax.set(_this.newContainer.querySelector('#page-content'), {
          y: 50,
          opacity: 0
        })
        _this.finish(_this, newContent)
        new TimelineMax({
          onComplete: () => {
            TweenMax.set(document.querySelector('#page-content'), {
              clearProps: 'transform,opacity'
            })
          }
        }).fromTo(_this.newContainer.querySelector('#page-content'), 0.3, {
          y: 50,
          opacity: 0
        }, {
          y: 0,
          force3D: true,
          opacity: 1
        });
      } else if (App.nextPageType == 'about') {

        new TimelineMax({
          onComplete: () => {
            new TimelineMax({
              onComplete: () => {
                TweenMax.set(document.querySelector('#page-content'), {
                  clearProps: 'transform,opacity'
                })
              }
            }).fromTo(_this.newContainer.querySelector('#page-content'), 1.3, {
              y: App.height
            }, {
              y: 0,
              ease: Expo.easeInOut
            });
            _this.finish(_this, newContent)
          }
        }).to(_this.newContainer.querySelector('#menu'), 0.2, {
          classList: '+=visible'
        })
      } else {
        _this.finish(_this, newContent)
      }
    },
    finish: function(_this, newContent) {

      _this.done()
      App.pageType = App.nextPageType
      document.body.setAttribute('data-filter', App.filtering)

      App.sizeSet()
      App.interact.init()
      Sliders.init()
      document.body.classList.remove('is-loading')
      App.menu.classList.add('visible')

      setTimeout(function() {
        TweenMax.set(document.querySelector('#page-content'), {
          clearProps: 'transform,opacity'
        })
      }, 500);

      if (window.ga) window.ga('send', 'pageview')
    }


  })
}

document.addEventListener("DOMContentLoaded", App.init);
