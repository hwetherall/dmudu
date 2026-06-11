# Foundations of Reinforcement Learning

*Source: `1-Foundations of Reinforcement Learning.pdf`*

RL Part 1: Agents, environments, rewards, and why RL is different from supervised learning.
Introduction
On 5 March 2025, the Association for Computing Machinery announced that
Andrew G. Barto and Richard S. Sutton had won the 2024 ACM A.M. Turing
Award, the computing world's equivalent of the Nobel Prize.
The citation was specific: "for developing the conceptual and algorithmic
foundations of reinforcement learning." Their 1998 textbook, "Reinforcement
Learning: An Introduction", has been cited over 75,000 times and is still the
standard reference for the field.
But Reinforcement learning (RL) sat quietly for decades, producing impressive
but niche results such as TD-Gammon in the 1990s and AlphaGo in 2016.

Then something shifted, almost every LLM released in the past two years (e.g.
DeepSeek-R1, GPT-5, etc.) was trained using some form of reinforcement
learning in its post-training pipeline.
RL, today, is a core part of how the most capable AI systems are built.
We're starting this RL series as a structured learning path, designed to build a
thorough understanding while developing a strong conceptual intuition of the
key topics and ideas.

Just as the MLOps and LLMOps crash course, each chapter will clearly explain
necessary concepts, provide examples, diagrams, and implementations.
👉
Prerequisites: We assume comfort with Python, basic probability and
linear algebra (expectations, simple distributions, vectors and matrices),
and fundamental ML/DL concepts. No prior background in reinforcement
learning is required. Some concepts will feel dense at times (they usually
are), but don't worry, we will build them up slowly.
In this chapter, we'll understand what makes RL different from supervised and
unsupervised learning, how to describe an agent interacting with an
environment, why exploration is fundamentally unavoidable, and how all of
this plays out in the simplest possible RL setting: the multi-armed bandit.
As always, every notion will be explained through clear examples and
walkthroughs to develop a solid understanding.
Let's begin!

What makes RL different
Most machine learning that we have seen so far falls into two buckets:
Supervised learning gives the model input-output pairs and asks it to learn
the mapping.
Unsupervised learning gives the model only inputs and asks it to find
structure, like clusters in a dataset or a lower-dimensional representation.
Reinforcement learning is a third kind of machine learning, and it is a genuinely
different setup.
There are no labeled pairs. There is no hidden structure to discover. Instead,
there is an agent that takes actions in an environment, and after each action, the
environment returns something called a reward.makeThe agent's goal is to pick
actions so that the total reward it collects over time is as large as possible.

Properties that set RL apart
There are four key properties that make RL distinctive:
The first is that feedback is evaluative, not instructive. A supervised loss
function tells the model exactly what the correct output was. An RL reward
just tells the agent how good its action was, not what the best action would
have been. The agent has to figure out "best" on its own.

The second is that the data distribution depends on the agent. In supervised
learning, the training set is fixed. In RL, the states the agent ends up in are a
consequence of its own choices. A bad early policy can steer the agent into
regions of the environment it would never have visited with a good policy.
This means the data is not independent and identically distributed (i.i.d.),
and thus most guarantees from supervised learning do not carry over
directly.
👉
In basic terms, a policy in reinforcement learning is the agent's strategy,
rulebook, or mapping function that dictates which action to take in a given
state to maximize cumulative rewards.
The third is delayed consequences. An action taken now might only pay off
many steps later.
👉
Figuring out which of many earlier actions was actually responsible for a
later reward is called the credit assignment problem, and it is one of RL's
central difficulties.

The fourth is the exploration-exploitation tradeoff. The agent has to use
what it knows to pick good actions. But it also has to try actions it is
uncertain about, in case they turn out to be even better. This tension does
not exist in supervised learning, where the labels are given.
👉
RL is sometimes called "learning from interaction" or "closed-loop
learning". The loop is important, the agent's output influences its future
input. In supervised learning, the training data is a closed file that will not
change no matter what the model does. In RL, the model's own behaviour
shapes what it sees next.
The agent-environment loop
The canonical RL diagram shows two boxes, one labeled "agent" and one labeled
"environment", with arrows between them. Every RL problem that we will study
in this series fits inside this picture.

The interaction
Time proceeds in discrete steps 
. At each step, three things
happen in order:
The agent observes the current state of the environment, written 
​.
👉
A state is a description of the situation the agent is in, enough to decide
what to do next. In a grid, for example, the state might be the agent's
t = 0, 1, 2, ...
St

coordinates. In chess, the state is the board position. In a dialogue model,
the state could be the conversation history so far.
The agent picks an action 
​ based on what it sees.
👉
The action is the agent's output, the only way it can influence the
environment. In chess, for example, an action is a legal move.
The environment then does two things. It transitions to a new state 
​,
and it emits a reward 
​, a scalar number that evaluates the previous
action. The next time step begins and the loop continues.
Stringing this together gives a trajectory, also called an episode when it has a
clear end:
At
St+1
Rt+1

Reading left to right, this is the entire history of the agent's interaction. Each 
 quartet is one transition, and much of RL is about learning
from such transitions.
Where does the agent end and the environment begin?
This question might sound philosophical but it has a concrete answer that
Sutton and Barto crystallized. The boundary between agent and environment is
drawn wherever the agent's direct control ends.
Anything the agent cannot change arbitrarily and instantly is part of the
environment, even if it is physically inside the agent's body.
👉
A point to note is, this is a modeling choice, not a physical fact. You draw
the boundary where it is useful for the problem you are trying to solve.
Drawing it in different places changes what counts as a state, what counts
as an action, and what the environment's dynamics look like.
The tradeoff here is practical:
(St, At, Rt+1, St+1)

Drawing the boundary tightly (almost everything is environment) keeps the
action space small and clean but leaves the agent with less control.
Drawing it loosely (a lot of internal state is "agent") gives the agent more
levers but makes learning harder because the action space explodes.
With the interaction picture in place, we now need to understand how does the
agent figure out the right policy when it starts out knowing nothing?
Exploration and exploitation
Suppose the agent has been interacting with an environment for a while and
has some sense of which actions tend to produce good rewards. At each step, it
faces a choice:
Should it take the action that looks best based on what it has seen so far?
Or
Should it try something different?

This is the exploration-exploitation tradeoff, and it is the defining tension of RL.
Exploitation means using current knowledge to pick the action that currently
looks best. This is what maximizes immediate expected reward given what the
agent knows.
Exploration means deliberately picking a different action to gather more
information about it. This does not maximize immediate expected reward, but it
can pay off later if the action turns out to be better than expected.

Pure exploitation fails. If the agent always picks the action that looks best after
only a few tries, it will often lock in on a suboptimal choice it happened to
sample well early on.
Pure exploration also fails. If the agent never uses what it has learned, it collects
endless data but never turns it into reward.
One way to picture this is that for each action, the agent holds a belief about its
reward (not a single number, but a distribution reflecting how sure it is).

A well-sampled action has a narrow belief; the agent is confident about
roughly where its reward lies.
An under-sampled action has a wide belief; its true value could plausibly be
much higher or much lower than the current estimate. Exploration is
worthwhile precisely because of that upper tail.
👉
Even if the two actions look comparable on average, the uncertain one
carries real upside, a chance it turns out to be genuinely better than the
action we currently favor.
This tradeoff shows up in every RL problem. It is cleanest in a setting where
there are no states to worry about, just actions and rewards. That setting is the
multi-armed bandit, and studying it carefully is how we will build intuition for
the rest of the series.
Multi-armed bandits

The multi-armed bandit problem is the simplest RL setting we can study. The
name comes from casino slot machines, each of which is sometimes called a
"one-armed bandit" because it has one lever and tends to take your money.
A multi-armed bandit is a row of   such machines, each with its own unknown
payout distribution, and the player has to decide which levers to pull.
The stripped-down setup is:
k

There are   actions (the "arms").
Each arm   has a true expected reward 
, which is unknown to the
agent.
At each step, the agent picks an arm, pulls it, and receives a reward sampled
from that arm's distribution.
The agent wants to maximize total reward over some number of pulls, for
example 
.
In this problem, there is no state. Every pull is independent of the last, and what
happens next does not depend on what the agent did before.
The problem is fundamentally about the exploration-exploitation tradeoff. If we
can solve this, we have understood one of RL's hardest ideas in its purest form.
Estimating action values from data
The agent does not know 
, but it can estimate it from experience. The most
natural estimate is the sample average of rewards received from that arm:
k
a
q∗(a)
1000
q∗(a)

Or, we can say, if before time , arm   has been pulled   times with rewards 
, then:
By the law of large numbers, as we pull the arm more and more: 
.
👉
Law of large numbers states that the average of the results obtained from
a large number of independent random samples converges to the true
value.
t
a
n
R1, R2, ... , Rn
Qt(a) →q∗(a)

Computing this average naively would be wasteful. There is an incremental
update that maintains the same estimate using only the previous estimate and
the new reward. Letting  count how many times a specific arm has been pulled
so far:
Unpacking:
​ is the estimate going into the -th pull, formed from 
 pulls.
​ is the reward from the  -th pull.
​ is the prediction error, i.e., how much the new reward differs
from what we expected.
​ is the step size, shrinking over time as we collect more samples. Thus,
later samples nudge the estimate less.
n
Qn
n
n −1
Rn
n
Rn −Qn
1
n

Intuitively, the structure of this update is:
With the sample-average estimator and its incremental update in hand, we now
have everything the agent needs to evaluate arms. What's still missing is a rule
for choosing between them.

At each step, the agent has to commit to one arm, and its current 
 values are
the only evidence it has. Should it pick the arm that looks best right now, or
hedge toward arms it's less sure about?
This is where the exploration-exploitation tradeoff becomes concrete in practice.
Let's now walk through four strategies, moving from the most naive to the more
principled approaches.
Strategy 1: greedy
The greedy strategy always picks the action with the highest current estimate:
This is pure exploitation.
It sounds sensible but fails badly in practice. If the agent happens to get a lucky
first pull on a mediocre arm, that arm's estimate becomes the highest and
Qn

greedy keeps pulling it forever. It never explores the other arms, so it never
discovers the truly best one.
Strategy 2:  -greedy
To improve on greedy strategy. the minimal fix is to mix in a bit of random
exploration. With probability   (typically a small number like 
), pick a
random action. Otherwise, be greedy:
This is called  -greedy, and despite its crudeness, it works surprisingly well.
With enough time, every arm gets pulled infinitely often (because of the random
exploration), so every 
 eventually converges to 
, plus the greedy part
of the policy picks the best arm most of the time.
ε
ε
0.1
ε
Qt(a)
q∗(a)

The tradeoff, however, is that  -greedy keeps exploring forever at the same rate,
even after it has figured out which arm is best. A common variation anneals 
toward zero over time, but then you have a new hyperparameter (the annealing
schedule) to tune.
Strategy 3: optimistic initial values
A quieter way to encourage exploration is to start with 
 set to a large
positive number, higher than any realistic reward. A greedy policy on top of this
will initially find that every arm's estimate is too high, and each pull will bring
the estimate down toward the true value.
The agent will naturally try every arm a few times before settling. No explicit
randomness needed.
👉
Optimistic initialization is elegant for stationary problems but does not
help in nonstationary ones, where the true values drift over time and the
optimism from step zero has long since worn off.
Strategy 4: upper confidence bound (UCB)
ε
ε
Q0(a)

-greedy explores uniformly at random, wasting pulls on arms that are clearly
bad. A smarter approach is to explore arms in proportion to how uncertain we
are about them. The upper confidence bound (UCB) rule is:
Here:
 is the current value estimate for arm  .
 is the number of times   has been pulled before time  .
 is the natural logarithm of the current time step, which grows slowly.
 is a constant controlling the exploration strength, typically around  .
The whole square-root term is the exploration bonus added to 
.
Reading structurally, UCB picks the arm that maximizes "estimate + bonus". The
bonus is large when 
 is small (i.e. we have not pulled this arm much) and
ε
Qt (a)
a
Nt(a)
a
t
ln t
c
2
Qt(a)
Nt(a)

small when 
 is large (we already know this arm well). The 
 in the
numerator ensures that as time passes, even well-sampled arms eventually get
an exploration bump.
UCB usually outperforms -greedy on the classic testbed. The reason is that the
bonus shrinks as an arm is pulled more, so UCB naturally moves on once an arm
is well understood. This concentrates its exploration on arms where the agent is
still genuinely uncertain. The result is that UCB learns which arm is best faster,
and stops wasting pulls on arms it already knows are bad.
👉
UCB's guarantees rely on stationary rewards and an enumerable action
set. Extending it to non-stationary settings requires modification.
Comparing strategies
Nt(a)
ln t
ε
Strategy
Idea
Parameters
Notes
Greedy
Always pick best current estimate
None
Locks in on lucky early wins.
-greedy
Random exploration with prob. 
Simple and robust, keeps exploring forever.
ε
ε
ε
Optimistic init
Start estimates high
Initial value
Free early exploration, stationary only.


Conclusion
In this chapter, we got ourselves familiar with some ideas of reinforcement
learning.
We saw what separates RL from supervised and unsupervised learning:
evaluative feedback instead of labels, data distributions shaped by the agent's
own actions, delayed consequences and the credit assignment problem, and the
unavoidable exploration-exploitation tradeoff.
ε

We then formalized the agent-environment loop as a trajectory of states, actions,
and rewards, with the boundary between agent and environment drawn
wherever the agent's direct control ends.
The multi-armed bandit gave us the cleanest setting to isolate exploration and
exploitation. We looked at greedy,  -greedy, optimistic initialization, and UCB.
Finally, we experimented on the 10-armed testbed. The results matched the
theory: smarter exploration leads to better long-run behavior, and UCB edged
out  -greedy by focusing its exploration on uncertain arms.
In the next chapter, we will continue to build on the core ideas of RL like the
Markov Decision Process (MDP), value functions, and more.
The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
