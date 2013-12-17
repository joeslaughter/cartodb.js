cdb.ui.common.ShareDialog = cdb.ui.common.Dialog.extend({

  tagName: 'div',
  className: 'cartodb-share-dialog',

  events: {
    'click .ok': '_ok',
    'click .cancel': '_cancel',
    'click .close': '_cancel',
    "click":                      '_stopPropagation',
    "dblclick":                   '_stopPropagation',
    "mousedown":                  '_stopPropagation'
  },

  default_options: {
    title: 'title',
    description: '',
    ok_title: 'Ok',
    cancel_title: 'Cancel',
    width: 300,
    height: 200,
    clean_on_hide: false,
    enter_to_confirm: false,
    template_name: 'common/views/dialog_base',
    ok_button_classes: 'button green',
    cancel_button_classes: '',
    modal_type: '',
    modal_class: '',
    include_footer: true,
    additionalButtons: []
  },

  initialize: function() {

    _.defaults(this.options, this.default_options);

    _.bindAll(this, 'render', '_keydown');

    this.isOpen = false;

    var self = this;

    if (this.options.target) {
      this.options.target.on("click", function() {
        self.open();
      })
    }

    // Keydown bindings for the dialog
    $(document).bind('keydown', this._keydown);

    // After removing the dialog, cleaning other bindings
    this.bind("clean", this._reClean);

  },

  _stopPropagation: function(ev) {

    ev.stopPropagation();

  },

  open: function() {

    var self = this;

    this.$el.show(0, function(){
      self.isOpen = true;
    });

  },

  hide: function() {

    var self = this;

    this.$el.hide(0, function(){
      self.isOpen = false;
    });

    if (this.options.clean_on_hide) {
      this.clean();
    }

  },

  toggle: function() {

    if (this.isOpen) {
      this.hide();
    } else {
      this.open();
    }

  },

  render: function() {

    var $el = this.$el;

    var title       = this.options.title;
    var description = this.options.description;
    var share_url   = this.options.share_url;
    var facebook_url, twitter_url;

    this.$el.addClass(this.options.size);

    if (this.options.facebook_url) {
      facebook_url = this.options.facebook_url;
    } else {
      facebook_url = "http://www.facebook.com/sharer.php?u=" + share_url + "&text=Map of " + title + ": " + description;
    }

    if (this.options.twitter_url) {
      twitter_url = this.options.twitter_url;
    } else {
      twitter_url = "https://twitter.com/share?url=" + share_url + "&text=Map of " + title + ": " + description + "... ";
    }

    var options = _.extend(this.options, { facebook_url: facebook_url, twitter_url: twitter_url });

    $el.html(this.options.template(options));

    $el.find(".modal").css({
      width: this.options.width
    });

    if (this.render_content) {
      this.$('.content').append(this.render_content());
    }

    if(this.options.modal_class) {
      this.$el.addClass(this.options.modal_class);
    }

    if (this.options.disableLinks) {
      this.$el.find("a").attr("target", "");
    }

    return this;
  }

});
