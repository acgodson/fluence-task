# fluence-task - An activity Web app that promotes sustainability through real life actions


FluenceTask encourages users to shift their daily habits towards tasks that improve sustainability and optimizes carbon footprint at home or workplace. 

Users connected on the peer check-in actions when they perform each task in real life. They also learn some potential advantages of each sustainable action.

Active users are displayed on the network and points are awarded for each sustainable action.


## Aqua & Fluence-JS

This idea leverages on the userList-inmemory service deployed on a fluence node from the Fluence-JS template at https://github.com/fluencelabs/fluent-pad.git


# Returning a list of scores

```
service UserScores("user-scores"):
    getFortune() ->  []f32

func tellFortune() ->  []f32:
    res <- UserScores.getFortune()
    <- res


func getRelayTime() -> u64:
    on HOST_PEER_ID:
        ts <- Peer.timestamp_ms()
    <- ts
```

## Browser Demo
Web Link http://sweet-art-3861.on.fleek.co/

## Hosted Service
This idea leverages on the userList-inmemory service already hosted on a fluence node from the Fluence-JS template at https://github.com/fluencelabs/fluent-pad.git

## Video Link 

https://youtu.be/gbksJYSGDFk 


## Possibilities
Calculated scores from each users can be  used to share tokenized rewards to participants (incentivization)



