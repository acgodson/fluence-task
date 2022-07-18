# fluence-task - An activity Web app that promotes sustainability through real life actions


FluenceTask encourages users to shift their daily habits towards tasks that improve sustainability and optimizes carbon footprint at home or workplace. 

Users connected on the peer log actions when they perform each task in real life. They also learn some potential advantages of each sustainable action.

Active users are displayed on the network and points are awarded for each sustainable action.


## Video Link 

https://youtu.be/bnpZkxYx4-U


## Browser Demo

Web Link http://sweet-art-3861.on.fleek.co/


# Returning a list of scores

```
service UserScores("user-scores"):
    getFortune() ->  []f32

func tellFortune() ->  []f32:
    res <- UserScores.getFortune()
    <- res

```

## Hosted Service (forks)
This idea also leverages on the userList-inmemory service already hosted on a fluence node from the Fluence-JS template at https://github.com/fluencelabs/fluent-pad.git


## Possibilities
Calculated scores from each users can be  used to share tokenized rewards to participants (incentivization)



