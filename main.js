$.when( $.ready ).then(function() {
  //Start game with 0 dollars
  let money = 0;
  //Make questions array as reference to avoid repetition
  let questions = [];

  //Enable selections
  $('.selection').on('click', playGame);

  function playGame() {
    let selection = $(this);

    //Only new cells can be selected
    if (selection.css('background-color') === 'rgb(218, 217, 215)') {
      $('.selection').off('click');
      //Clear display of previous questions and choices
      $('.question').text();
      $('.choice').text();
      $('.choice').css('background-color', 'rgb(218, 217, 215)');
      //Highlight selected selection
      selection.css('background-color', 'rgb(169, 165, 162)');

      //Make API URL according to selection data-attributes
      let category = selection.attr('data-category');
      let difficulty = selection.attr('data-difficulty');
      let url = 'https://opentdb.com/api.php?' +
      'amount=1' +
      `&category=${category}` +
      `&difficulty=${difficulty}` +
      '&type=multiple';

      //Use URL to call API
      callAPI();

      function callAPI() {
        $.ajax({
          url: url,
          dataType: 'json',
          type: 'GET'
        }).done(function(response) {
          let question = response.results[0].question;

          //Questions must not be repeated
          if (!questions.includes(question)) {
            questions.push(question);

            let choices = response.results[0].incorrect_answers;
            //Dispose of last icorrect answer to have only three choices
            choices.pop();
            let correctAnswer = response.results[0].correct_answer;
            choices.push(correctAnswer);

            //Shuffle choices
            choices.sort(function() {
              return 0.5 - Math.random();
            })

            //Display questions and choices
            //Jquery.html fixes HTML entities from API
            $('.question').html(questions[questions.length - 1]);

            choices.forEach((choice, i) => {
              $(`.choice${i}`).html(choice);
              $(`.choice${i}`).attr('data-choice', choice);
            });

            //Make a choice
            $('.choice').on('click', function() {
              let choice = $(this);

              if (choice.css('background-color') === 'rgb(218, 217, 215)') {
                //Only one choice can be selected
                $('.choice').off('click');

                let points = parseInt(selection.text().replace('$', ''));

                //Check if choice is correct
                if (choice.attr('data-choice') === correctAnswer) {
                  choice.css('background-color', 'rgb(204, 175, 102)');
                  selection.css('background-color', 'rgb(204, 175, 102)');

                  money += points;
                } else {
                  choice.css('background-color', 'rgb(169, 165, 162)');
                  selection.css('background-color', 'rgb(169, 165, 162)');

                  money -= points;

                  //Highlight correct choice
                  for (let i = 0; i < choices.length; i++) {
                    if ($(`.choice${i}`).attr('data-choice') === correctAnswer) {
                      $(`.choice${i}`).css('background-color', 'rgb(204, 175, 102)');
                    }
                  }
                }

                //Updates score
                if (money >= 0) {
                  $('.total').text('$' + money);
                } else {
                  $('.total').text('-' + '$' + Math.abs(money));
                }
              }

              $('.selection').on('click', playGame);
            })
          } else {
            callAPI();
          }
        })
      }
    }
  }

  $('.reset').on('click', function() {
    window.location.reload();
  })
});
