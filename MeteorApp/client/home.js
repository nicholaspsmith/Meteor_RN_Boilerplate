Template.home.onCreated(function() {
  this.subscribe('posts');
});

Template.home.helpers({
  count() {
    return Posts.find().count();
  },
  posts() {
    return Posts.find();
  }
});

Template.home.events({
  'click #increment': function(e) {
    e.preventDefault();

    Meteor.call('addPost');
  },

  'click #decrement': function(e) {
    e.preventDefault();

    Meteor.call('deletePost');
  }
})
