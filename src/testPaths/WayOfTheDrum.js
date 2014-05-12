define(function(require) {
  var WayOfTheDrumPath = {
    id: "way-of-the-drum",
    title: "Way of the Drum",
    description: "<p>This path helps you develop your sense of rhythm.</p>",
    icon: 'drum',
    viewType: 'PathView',
    nodeType: 'path',
    children: [
      {
        title: "White Belt",
        description: "Medium tempos",
        viewType: "PathView",
        nodeType: "scroll",
        iconClass: "white-belt",
        children: [
          {
            viewType: "ExerciseDeckRunnerView", 
            nodeType: "deck", 
            deckRunnerDefinition: {
              exerciseSlides: [
                {viewType: 'FeelTheBeatExerciseView', modelType: 'ExerciseSlideModel',
                  bpm: 80, length: 8, threshold: .4, maxFailedBeats: 4},
                {viewType: 'FeelTheBeatExerciseView', modelType: 'ExerciseSlideModel',
                  bpm: 85, length: 8, threshold: .2, maxFailedBeats: 4},
                {viewType: 'FeelTheBeatExerciseView', modelType: 'ExerciseSlideModel',
                  bpm: 80, length: 8, threshold: .3, maxFailedBeats: 4},
                {viewType: 'FeelTheBeatExerciseView', modelType: 'ExerciseSlideModel',
                  bpm: 85, length: 8, threshold: .1, maxFailedBeats: 4},
              ],
            }
          },
        ]
      },
    ]
  };

  return WayOfTheDrumPath;
});
