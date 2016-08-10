import UserStorage from 'storages/user'
import UserView from 'views/user'
import Cache from 'storages/cache'

class UserContainerView {
  constructor () {
    this.cache = new Cache();
    this.userStorage = new UserStorage();
  }

  actions () {
    let _this = this;

    $(document).on('mouseover', '.b-comment__user > a:not(.userscript-rendered), a.story__author:not(.userscript-rendered)', (event) => {
      _this.render(event);
    });

    $(document).on('mouseout', '.b-comment__user > a:not(.userscript-rendered), a.story__author:not(.userscript-rendered)', (event) => {
      _this.hide(event);
    });
  }

  render (event) {
    let _this = this;
    
    let userUrl = event.currentTarget.href;
    let tooltip = this.resolveContainer(userUrl);

    this.setupOffset(tooltip, event.currentTarget);

    $('body').append(tooltip);

    let userPromise = _this.userStorage.match(userUrl);
    let userView = new UserView(userPromise);

    userView.render().done((html) => {
      tooltip.html(html);
      _this.cache.add(userUrl, tooltip);
    });
  }

  hide (event) {
    $('.tooltip-profile').remove();
  }

  resolveContainer (userUrl) {
    let tooltip;

    if (this.cache.has(userUrl)) {
      return tooltip = this.cache.match(userUrl);
    }

    tooltip = $('<div></div>');

    tooltip
      .addClass('tooltip-profile')
      .css('position', 'absolute')
      .css('display', 'block')
      .css('z-index', '1000000')
      .css('width', '460px')
      .css('minHeight', '121px')
      .css('background', '#f0f1eb')
      .css('border-radius', '3px')
      .css('border', '1px solid #d0dde5')
      .css('padding', '15px')
      .html('');

    return tooltip;
  }

  setupOffset (tooltip, targetElement) {
    let offset = $(targetElement).offset();

    tooltip
      .css('left', `${offset.left - 2}px`)
      .css('top', `${offset.top + targetElement.offsetHeight + 2}px`);

    return tooltip;
  }
}

export default UserContainerView