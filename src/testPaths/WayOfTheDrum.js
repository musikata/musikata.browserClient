define(function(require) {
  var WayOfTheDrumPath = {
    id: "way-of-the-drum",
    title: "Way of the Drum",
    description: "<p>This path helps you develop your sense of rhythm.</p>",
    icon: 'drum',
    viewType: 'path',
    nodeType: 'path',
    children: [
      {
        title: "White Belt",
        description: "Medium tempos",
        viewType: "path",
        nodeType: "scroll",
        iconClass: "white-belt",
        children: [
          {viewType: "deck", nodeType: "deck", 
            exerciseSlides: [
              {type: 'FeelTheBeat', bpm: 80, length: 8, threshold: .4, maxFailedBeats: 4},
              {type: 'FeelTheBeat', bpm: 85, length: 8, threshold: .2, maxFailedBeats: 4},
              {type: 'FeelTheBeat', bpm: 80, length: 8, threshold: .3, maxFailedBeats: 4},
              {type: 'FeelTheBeat', bpm: 85, length: 8, threshold: .1, maxFailedBeats: 4}
            ],
          },
        ]
      },
    ]
  };

  return WayOfTheDrumPath;
});
