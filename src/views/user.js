class UserView {
  constructor (userPromise) {
    this.userPromise = $.when(userPromise);
  }

  render () {
    let _this = this;

    return this.userPromise.then((userDOM) => {
      let profile = $(userDOM).find('.profile_wrap');

      profile.find('table td').eq(2).remove();
      profile.find('.b-button').eq(0).remove();
      profile.find('.user-profile-tools').eq(0).remove();

      profile
        .css('width', 'inherit')
        .css('maxWidth', '460px')
        .css('padding', '0px')
        .css('margin', '0px');

      return $.when(profile);
    });
  }
};

export default UserView;