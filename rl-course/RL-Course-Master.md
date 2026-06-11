# Reinforcement Learning Course

Combined text extraction from all course PDFs, in order.

---

## Part 1: Foundations of Reinforcement Learning

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



These tradeoffs are easier to see than to describe. Next, in the hands-on section,
we'll run each strategy on a fixed bandit and compare their learning curves.
Hands-on: the 10-armed testbed
Time to build the things we have been talking about. We will implement the
classic 10-armed testbed, and use it to compare greedy,  -greedy with two values
of  , and UCB.
By the end we will have plots showing exactly how each strategy learns over
time, and concrete numbers for how well they do.
Setup
Strategy
Idea
Parameters
Notes
UCB
Exploration bonus
Usually better on standard testbed, assumes stationarit
c
ε
ε

The code and project setup we are using are attached below as a zip file. You can
simply extract it and run  uv sync  command to get going.
Download the zip file below:
bandits
bandits.zip
For details about the versions and dependencies, you can check the  .python-
version  and  pyproject.toml  files.
👉
It is recommended to follow the explanation ahead side-by-side with the
above attached project for a more comprehensive understanding.
• 232 KB
Sign Out
Account

The testbed setup
The 10-armed testbed works like this:
We have 
 arms.
The true mean reward for each arm, 
, is drawn once from a standard
normal 
. Once drawn, these means stay fixed for the rest of the run
(this is a stationary bandit).
Each time the agent pulls arm  , the reward is sampled from 
.
To average out the randomness in any single run, we repeat the experiment on 
 independently generated bandits, each for 
 steps, and average the
results. This produces smooth, interpretable curves.
Now let's look at the implementation:
k = 10
q∗(a)
N (0, 1)
a
N (q∗(a), 1)
2000
1000

Bandit  class is the environment. Here we:
Draw the  true mean rewards 
 once, from a standard normal 
, and store them in q_star . These values are then fixed for the lifetime of the
object, which is what makes the bandit "stationary".
k
q∗(a)
N (0, 1)

Record optimal_action , the index of the best arm. The agent never sees this; it
is kept for our own bookkeeping so we can later measure how often the
agent picks the genuinely best arm.
Define the pull  method, which returns a reward sampled fresh from
 every time it is called. Repeated pulls of the same arm give
different numbers fluctuating around that arm's true mean, and this noise is
exactly what makes the problem nontrivial. If pulls were deterministic, one
sample would reveal each arm's value and there would be nothing to learn.
The seed  argument fixes the random number generator so a given seed
always produces the same bandit task, which is what lets us average cleanly
across 2,000 independent runs later on.
Next up we have our implementations of strategies:
N (q∗(a), 1)



Here:
EpsilonGreedy  class:
Maintains two NumPy arrays: Q , holding the current value estimate for
each arm, and N , the count of how many times each arm has been
pulled. Both start at zero.
The select_action  method implements the -greedy rule: with
probability , it samples a random arm (the exploration branch);
otherwise, it picks the arm with the highest current estimate (the
ε
ε

exploitation branch). When multiple arms are tied at the top, it finds all
of them and rng.choice  picks one at random.
The update  method applies the incremental average rule we derived
earlier. First it increments the pull count for the chosen arm. Then it
nudges the estimate toward the observed reward, with step size 
.
UCB  class:
Same bookkeeping as EpsilonGreedy : Q  for estimates, N  for counts, plus
one extra piece: self.t , a global step counter incremented on every
action selection. This counter is the  that appears inside 
 in the UCB
formula.
The select_action  method first checks whether any arm has never been
pulled. If so, it picks one of those untried arms at random. This handles
the edge case where N[a] = 0  would technically be a division-by-zero.
Forcing every arm to be tried at least once is the standard fix.
Once all arms have been tried, the agent computes the full UCB score Q
+ c * sqrt(ln(t) / N)  as a vectorized NumPy expression, one number per
arm, and picks the arm with the highest score (with random tie-
breaking).
The update  method is same as earlier: incremental average.
1/N
t
ln t

Now finally let's take a look at the code that helps us run our experiment:



Here:

run_experiment  function is the training loop that glues the bandit
environment and the agent together.
It takes an agent_factory  (a function that produces fresh agents on
demand), the number of independent runs, and the number of steps per
run.
Two result arrays are preallocated: rewards[run, step]  to hold the reward
received on each step of each run, and optimal[run, step]  to hold a
boolean flagging whether that step's action was the truly best arm.
The outer loop creates a fresh bandit and a fresh agent for each of the
n_runs  runs, seeding both for reproducibility. Crucially, each run gets a
different bandit, so the 2,000 runs span 2,000 distinct bandit problems.
The inner loop runs the RL interaction cycle: the agent picks an action,
the environment returns a reward, the agent updates its estimates, and
the statistics are recorded.
After all runs finish, the function returns two 1D arrays of length
n_steps :
the average reward at each step

the percentage of optimal actions at each step, both averaged across
the 2,000 independent runs.
👉
Averaging is what smooths out the noise from any single bandit task and
gives the clean learning curves we plot.
main  function is the orchestrator.
It defines the four configurations to compare, using lambda seed: ...
closures so each configuration can be instantiated as a fresh agent
inside run_experiment .
The loop runs each configuration for 2,000 bandit tasks of 1,000 steps
each, prints a final-step summary, and stores the full learning curves for
plotting.
Results
Running the four configurations (greedy, 
, 
, UCB with 
)
for 
 runs of 
 steps each, here is what happens at step 
:
ε = 0.01 ε = 0.1
c = 2
2000
1000
1000

The ordering matches the theory:
Greedy plateaus quickly because it stops exploring, and on average only
finds the true best arm in a third of runs.
 is too cautious, it does find the best arm eventually but slowly.
 learns faster and ends up picking the best arm about 80 percent of
the time.
UCB beats them all, because it focuses its exploration on uncertain arms
rather than exploring uniformly.
ε = 0.01
ε = 0.1

One subtle thing worth noticing in the plots: greedy's average reward rises very
fast in the first few steps (it immediately exploits whatever looked good early),

but then stalls.  -greedy learns slower but keeps improving. This shape is the
signature of the exploration-exploitation tradeoff: the strategy that is best right
now is rarely the one that will be best in a thousand steps.
Alright now, with this we complete the walkthrough of our demo and conclude
the discussion for this chapter. In the upcoming chapters, we will continue to
build on the core ideas of RL, and explore concepts and their implementations
wherever applicable.
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
ε
ε

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Or
If you wish to connect privately, feel free to initiate a chat here:
Published on Apr 26, 2026
Next
Comments
Share
Markov Decision Processes and Value Functions

---

## Part 2: Markov Decision Processes and Value Functions

*Source: `2-Markov Decision Processes and Value Functions.pdf`*

RL Part 2: Markov decision processes, returns, policies, and value functions.
Recap
In the previous chapter, we introduced reinforcement learning as a third kind of
machine learning, distinct from supervised and unsupervised learning.

Sign Out
Account

We saw the core agent-environment loop, where the agent picks actions, the
environment returns rewards and a new state, and the cycle continues.

We discussed four properties that make RL distinctive: feedback is evaluative
rather than instructive, the data distribution depends on the agent's own
behavior, consequences are delayed and create the credit assignment problem,
and exploration cannot be avoided.

We then studied the simplest possible RL problem: the multi-armed bandit. With
no states to track, only   actions and unknown reward distributions, the bandit
isolates the exploration-exploitation tradeoff.
k

We worked through four strategies, namely greedy,  -greedy, optimistic initial
values, and upper confidence bound (UCB), and ran them on the 10-armed
testbed to see how each one trades off exploration against exploitation in
practice.
ε

Overall, the previous chapter familiarized us with some of the most basic ideas
of reinforcement learning.

If you haven't yet gone through Part 1, we recommend reviewing it first, as it
establishes the conceptual foundation essential for understanding the material
we're about to cover.
Read it here:
In this chapter, we will understand and explore the Markov property, Markov
decision processes (MDPs), value functions and much more.
As always, every notion will be explained through clear examples and
walkthroughs to develop a solid understanding.
Let's begin!
Foundations of Reinforcement Learning
RL Part 1: Agents, environments, rewards, and why RL is different from
supervised learning.
Daily Dose of Data Science • Akshay Pachaar

Introduction
In Chapter 1, the bandit gave us a clean way to think about exploration and
exploitation. But it hid a detail that changes a lot of things. Real problems are
not stateless.
In chess, the move you should make depends on the current board position. In
driving, the next steering action depends on the surrounding traffic. In a
dialogue, what to say next depends on the conversation so far. The action you
take changes the situation you face afterward, and the situation determines
which actions are good.
To talk about states, transitions, and how rewards depend on both, we need a
formal vocabulary.

That vocabulary is the Markov decision process (MDP), and it underpins
essentially every algorithm we will study.
We will explore the framework of MDPs. We will start with the Markov property,
which is what makes the whole edifice tractable. We will then formalize the
MDP itself and discuss episodic versus continuing tasks. From there, we will
define the return, discounting, and the reward hypothesis.

We will introduce policies as the object the agent actually learns, and define two
value functions, 
 and 
​, that measure how good states and actions are under
a given policy.
Finally, we will build a small gridworld from scratch and use Monte Carlo
rollouts to estimate 
​ for a fixed policy.
The Markov property
Before defining what an MDP is, we need the assumption it rests on: the Markov
property.
Informally, a state is Markov if the future depends on the past only through the
present. This means that once you know the current state, the entire history that
led to it is irrelevant for predicting what happens next.
Formally, the state 
​ is Markov if the distribution of the next state conditioned
on the entire history reduces to a distribution conditioned only on the current
state and action:
vπ
qπ
vπ
St

👉
We are using 
 for generic probability statements, since we'll be using 
for transition function.
Here, 
​ is the resulting next state, and 
 is a particular value the next state
can take. The left side is the probability of landing in 
 given the entire history
of states and actions. The right side is the same probability, but conditioned only
on the current state and action.
The Markov property says these two are equal.
This has enormous benefits.
Without it, predicting the next state would, in principle, require remembering
everything the agent has ever seen. With it, we only need the current state. The
Pr
P
St+1
s'
s'

state is a complete summary of the past, sufficient to predict the future.
Here's a concrete example. Consider the Atari game Breakout, with the bat at the
bottom and a ball bouncing around.
If we treat a single screenshot as the state, is the state Markov? The answer is no.
From one frame, you cannot tell which direction the ball is moving. There are at
least four directions consistent with any given frame, and they lead to very
different next states.
But what if the state is the past four frames stacked together? Now you can
compute the ball's position and velocity, and the next frame becomes
predictable. The state, redefined this way, is approximately Markov.

This points to something important. "Markovian-ness" is often a modeling
choice, not a physical fact. The same physical environment can be Markov or
not, depending on what you decide to put in the state.
👉
The art of formulating an RL problem is, in large part, designing a state
representation that makes the property hold, or hold well enough.

When the property genuinely cannot hold, the agent only sees observations that
are partial summaries of a true underlying state it cannot directly access.
This setting has its own name, which is called the partially observable Markov
decision process (POMDP), introduced by Karl Johan Åström in 1965 for the
discrete state space.
In a POMDP, the true state can be called hidden, not in the sense of being
deliberately concealed, but in the sense that the agent only sees it indirectly
through observations. POMDPs add an observation set and an observation
function, and require the agent to track a probability distribution over what the
hidden state might be, called a belief.
👉
Note that we will not be studying POMDPs in depth, but it is worth
knowing they exist, since many real-world problems are partially
observable in nature.
👉
A useful rule of thumb: if you find yourself wanting to add "history" to the
agent's input, that is a sign your current state is not Markov. The fix is to
enrich the state representation, not to give the agent memory tricks.

At this point, we must also understand that the Markov property does not say
states are deterministic. The next state is allowed to be random. The property
only says the randomness depends solely on the current state and action.
👉
"Memoryless" is sometimes used as a synonym for Markov. The two mean
the same thing here: the past history can be discarded once the current
state is known.
With the Markov property in place, we can now formalize the agent-
environment interaction as a tuple of components, each playing a specific role.
The MDP framework
A Markov decision process is a 5-tuple:

Each piece has a precise meaning. Let's go through them one at a time.
 is the set of states, called the state space. It can be finite (every cell of a
4×4 grid), countably infinite (every legal chess position), or continuous
(every joint angle of a robot arm).
👉
We will mostly stay in the finite-state setting in the early chapters, since it
makes algorithms easier to reason about and analyze.
 is the set of actions, called the action space. In a grid (or gridworld) it
might be {up, down, left, right}. In chess it is the set of all legal moves from
the current position. Like the state space, the action space can be finite,
countable, or continuous.
 is the transition function. Given a current state and action, it specifies the
probability distribution over next states:
S
A
P

👉
The Markov property is baked into this definition: the transition depends
only on 
, not on anything earlier.
👉
The transition function 
 is sometimes called the dynamics.
 is the reward function. There are two common formulations:
 as the expected reward for taking action   in state 
 when the reward also depends on the resulting next state
👉
Both are widely used; the differences usually do not matter
mathematically.
(s, a)
P
R
R(s, a)
a
s
R(s, a, s′)

is the discount factor, a real number in 
. It controls how much the
agent values future rewards relative to immediate ones. We will dedicate a
full section to it shortly, since it deserves more than a single line.
A useful way to think about this is that an MDP is a complete mathematical
specification of the environment. Once you have written down 
,
the environment has no remaining unspecified parameters. Anything left for the
agent to figure out is internal to the agent: which actions to take in which states.
γ
[0, 1]
(S, A, P, R, γ)

It is worth pausing on what this framework includes:
Stochasticity is built in, since 
 is a probability distribution rather than a
deterministic function.
Sequential dependency is built in, since the next state depends on the
current one.
P

Goal-directedness is built in, since the agent is trying to maximize
cumulative reward.
👉
"An MDP is solved when we know its optimal policy." This phrase will
recur throughout. For now, just keep it in mind. We will define what
"optimal" means precisely once we have the value functions in hand.
It is also worth noticing that the bandits we studied in chapter 1 are MDPs. They
are the special case where 
. With a single state, the transition function is
trivial (you always end up in the same state), and the reward depends only on
the action. The exploration-exploitation tradeoff we wrestled with there is the
same one we will wrestle with in larger MDPs, just without the complication of
states.
👉
Technically, in the MDP formalism, the bandit is a single-state MDP. But
since that one state never changes and carries no information, we
informally/casually describe it as "stateless".
∣S ∣= 1

Now that we understand the MDP framework, there is one quick distinction
worth pausing on before we move to how interactions unfold over time. The
MDP contains 
 and 
, but it does not say whether the agent has access to
them.
Model-based and model-free learning
A "model" here means knowledge of the environment's dynamics, namely the
transition function 
 and the reward function 
. The MDP we just defined
contains both. The question is whether the agent has access to them.
In the model-based setting, the agent has 
 and 
 in hand. It can simulate
transitions in its head, plan ahead, and compute outcomes.
In the model-free setting, the agent does not have 
 and 
. It only has access to
samples drawn from interaction: take an action, observe what state you land in
and what reward you get. Whatever the agent learns about the environment, it
learns from this stream of experience.
P
R
P
R
P
R
P
R

👉
A useful mental model: model-based RL is "learn or know the rules, then
plan". Model-free RL is "ignore the rules, just learn from playing". This
essentially means, model-free learns after trying, but model-based can
even decide before trying.

With the model-based and model-free distinction in mind, we can now turn
from the static description of the environment to how interactions unfold over
time. The first thing to pin down is whether those interactions terminate or run
indefinitely.
Episodic and continuing tasks
The agent-environment loop unfolds over time. It can either run indefinitely or
naturally come to an end.
In an episodic task, the interaction breaks into self-contained episodes. Each
episode starts from some initial state, runs for a finite number of steps, and ends
in a terminal state. For example, a chess game is episodic, and similarly a
gridworld with a goal cell is episodic.
In a continuing task, the interaction has no natural endpoint. A robot balancing
a pole forever or a recommender system serving an endless stream of users.
These run, in principle, indefinitely. There is no terminal state, and the agent
keeps acting and receiving rewards without bound.

The distinction matters because it changes how we define the agent's objective:
In an episodic task, summing rewards from the start of an episode to its end
is well-defined; the sum is finite because the episode is finite.
In a continuing task, simply summing rewards forever is useless as an
objective. We need a way to keep the sum bounded, which is what
discounting will do for us (we'll learn more on it in the next section).

👉
Some tasks can either be continuing or episodic depending on how you set
up the state.
With the episodic versus continuing distinction in hand, we can now define the
agent's actual objective: the return.
Returns and discounting
The agent picks actions over time and receives rewards 
. To talk
about its goal, we need a single number that summarizes the future. That
number is the return, written 
​:
R1, R2, R3, ...
Gt

Unpacking:
​ is the return starting at time  .
The first term, 
​, is the reward received from the action taken at .
Similarly the 
​, but weighted by   and so on.
The discount factor 
 is what turns this from just a summing exercise
into a flexible objective.
To see how it shapes behavior, consider a fixed reward sequence 
, where the agent receives reward 1 for the next five steps
and zero forever after.
Under different choices of  , the return G_0​ comes out very differently:
: 
. Only the immediate reward counts; everything else is
multiplied by zero.
: 
. The first
reward dominates; later rewards add diminishing contributions.
: 
. All five rewards
contribute substantially.
Gt
t
Rt+1
t
Rt+2
γ
γ ∈[0, 1]
(1, 1, 1, 1, 1, 0, 0, ...)
γ
γ = 0 G0 = 1
γ = 0.5 G0 = 1 + 0.5 + 0.25 + 0.125 + 0.0625 = 1.9375
γ = 0.9 G0 = 1 + 0.9 + 0.81 + 0.729 + 0.6561 ≈4.10

(undiscounted): 
. Every future reward counts the same as an
immediate one.
The intuition is that   controls how far-sighted the agent is. A small   produces a
myopic agent that grabs whatever reward is immediately available. A large 
produces a far-sighted agent that values long-term gains.
The return also has a useful recursive structure. From the definition,
γ = 1
G0 = 5
γ
γ
γ

This says the return at time   is the immediate reward plus the discounted
return from the next time step. The agent's long-term goal decomposes cleanly
into "the thing that happens" plus "everything after that".
t

👉
For episodic tasks, you can use 
 (no discounting) safely; the episode
ends in finite time so the return is bounded. For continuing tasks, use 
. Otherwise the return can be infinite and the optimization problem
becomes ill-defined.
With returns defined, we now have a way to describe what the agent is trying to
maximize over time. But this raises a deeper question: why should cumulative
reward be the right objective in the first place?
The reward hypothesis
The entire RL framework rests on a single bold claim, often called the reward
hypothesis. Sutton and Barto formulate it in a way that basically says, any goal
can be captured as the maximization of the expected cumulative sum of a scalar
reward.
This is a strong commitment. It says that whatever we want the agent to do, we
can encode that goal as a scalar reward signal. The agent's job then reduces to
γ = 1
γ < 1

maximizing the expected cumulative discounted sum of that signal.
The hypothesis is what justifies the entire structure we have built. It is why we
can write down a single number 
​ and call its expectation the agent's
objective.
Gt

It is worth being honest about its limits, however. The hypothesis is a hypothesis,
not a theorem. Recent studies show that scalar rewards can capture a fairly
broad class of preferences, but only under certain rationality assumptions.
Real human preferences may not always satisfy them. Multi-objective settings,
where the agent must trade-off, say, cost against safety against latency, push
against the scalar formulation; workarounds exist, but they break some of the
elegance of the standard framework.
Even when the hypothesis holds in principle, designing the reward function in
practice is hard. A small misspecification can lead to behavior that maximizes
the reward as written but violates the spirit of the task. This failure mode is
called reward hacking, and it has become a central concern in modern RL
training.
We will return to reward hacking and reward design in a later chapter. For now,
the takeaway is that the reward hypothesis gives us a clean foundation, but the
burden of correctly specifying the reward is non-trivial and is exactly where
many real-world RL systems break.

👉
Goodhart's law applies here: when a measure becomes a target, it ceases to
be a good measure. Reward hacking is Goodhart's law applied to RL.
We have now defined the environment, the return, and the underlying
assumption that justifies maximizing it. Now let's understand the missing piece:
the agent's behavior. How does the agent decide what to do?
Policies
A policy is the agent's behavior rule. It maps states to actions, or more generally
to distributions over actions.
There are two flavors:
A deterministic policy, written 
, is a lookup table (in state  , take
action  ). There is no randomness in the agent's decision; the same state
always produces the same action.
π(s) = a
s
a

A stochastic policy, written 
, is a probability distribution over
actions for each state:
👉
For each state  , the values 
 across all actions sum to 1.
π(a ∣s)
s
π(a ∣s)

We now have the environment, the return, and the policy. The next step is to
define what "good" means for a policy. That is the job of value functions.
State-value function

Given a policy, we want to ask: starting from state   and following   forever
after, how much total reward do I expect to collect?
The answer is the state-value function, written 
:
Unpacking:
 is the expected return starting from state   and following  .
The expectation 
​ is taken over two sources of randomness:
the actions sampled from the policy 
the next states sampled from the environment's transition function 
The condition 
 pins down the starting state.
👉
Important note: values are policy-dependent.
s
π
vπ(s)
vπ(s)
s
π
Eπ
π(⋅∣⋅)
P
St = s

Spelling out the structure: starting in  , the agent samples an action from  , the
environment returns a reward and a next state, the agent samples another
action from  , and so on. Each rollout (one complete run of the policy from  to
termination) produces a return 
​, which is itself random. 
 is the average
of those returns over all the randomness, conditional on starting in  .
👉
The crucial thing to internalize is that values depend on the policy. The
same state can be valuable under one policy and worthless under another.
Note: Terminal states have value zero by convention, since no further rewards
can be collected from them.
s
π
π
s
Gt
vπ(s)
s

Now that we have 
​ for evaluating states, the natural next question is: what
about evaluating actions? That is the action-value function.
Action-value function
The action-value function 
 measures the expected return from taking
action   in state   and then following   forever after:
Unpacking:
 is the expected return starting from state  , with the first action
forced to be  , and following the policy   for every action thereafter.
The expectation is taken over the same two sources of randomness as
before: the policy's action distributions for all subsequent steps, and the
vπ
qπ(s, a)
a
s
π
qπ(s, a)
s
a
π

environment's transition probabilities throughout.
The difference from 
​ is subtle but important. 
 assumes the agent samples
its first action from   as well. But 
 pins down the first action and then
defers to  . Thus, the two are linked as:
In words: the value of state  under policy  is the policy-weighted average of
the action-values 
 across all possible actions.
Now a question arises, why bother with 
​ when 
​ already exists? The answer
is action selection. If you know 
 for every action in state  , picking the
best action is just an arg-max:
vπ
vπ(s)
π
qπ(s, a)
π
s
π
qπ(s, a)
qπ
vπ
qπ(s, a)
s

The beauty is you do not need the environment dynamics to do this. With 
​, the
values per action are right there, just pick the best one and you're done.
By contrast, 
​ only gives values per state, not per action. To pick the best action
from 
​, you'd need to look at every action's possible next states, weight each by
its transition probability 
, and sum up, which requires knowing 
.
The transition function is exactly what's typically unavailable in real problems.
This is why 
​ is the natural object to estimate in model-free RL: it absorbs the
dynamics into itself, so the agent never has to represent them explicitly.
qπ
vπ
vπ
P(s′ ∣s, a)
P
qπ

👉
 is also called the "Q-function" or "Q-value".
We have now defined everything: states, actions, dynamics, rewards, returns,
policies, and the two value functions. The pieces are in place. Now let's bridge to
the hands-on section.
qπ(s, a)

Hands-on: gridworld and Monte Carlo policy
evaluation
We have defined 
​ as an expectation, but how do we actually compute it?
One natural answer: simulate many episodes under  , compute the return from
each visited state, and average. The averaged return converges to 
​ by the law
of large numbers. This is called Monte Carlo (MC) policy evaluation.
Setup
The code and project setup we are using are attached below as a zip file. You can
simply extract it and run  uv sync  command to get going.
vπ
π
vπ

Download the zip file below:
gridworld-mc
gridworld-mc.zip
For details about the versions and dependencies, you can check the  .python-
version  and  pyproject.toml  files.
👉
It is recommended to follow the explanation ahead side-by-side with the
above attached project for a more comprehensive understanding.
The environment
We use a 4×4 gridworld matching Sutton and Barto's Example 4.1 from the book.
The grid has 16 cells. Two of them, the top-left at coordinate 
 and the
bottom-right at 
, are terminal. The remaining 14 are non-terminal.
The agent has four actions: up, right, down, and left. Transitions are
deterministic; if the chosen action would take the agent off the grid, it stays in
• 71 KB
(0, 0)
(3, 3)

place (it bounces off the wall). Every transition gives reward 
, until the
episode ends when the agent reaches a terminal state.
This setup makes the value of every state intuitive. Under any policy, 
 is
roughly the negative of the expected number of steps to reach a terminal state.
The further from a terminal, the more negative the value.
Now let's look at the code:
−1
vπ(s)



The  GridWorld  class is the environment. A few things to note about how it is built:
__init__  sets up the grid size, the two terminal cells, and the action-to-
direction mapping.  n_actions  exposes the number of actions for the policy
code to use.
reset  rejection-samples a starting cell until one is non-terminal, then stores
it as the current state. Sampling uniformly across non-terminals ensures
every non-terminal state has positive probability of being an episode start,
so in the limit of many episodes each one is visited as a start.
step  applies the action delta, clamps movement at the walls so the agent
stays in place when it would otherwise leave the grid, returns

reward  -1.0  regardless of the transition, and marks  done = True  when the
next state is terminal. The state is updated before returning.
The class deliberately has no notion of a policy, no value table, and no learning
logic. It is purely the environment, kept clean so the MC code can interact with it
through a standard  reset  /  step  loop without coupling.
The MC evaluator
Monte Carlo policy evaluation for a fixed policy on a gridworld:



This file has three pieces:
random_policy  is the equiprobable random policy, returning a uniformly-
sampled action index for each call. No state-dependence: it samples the
same way from every state. This is the policy whose value we are
estimating.
run_episode  runs the standard interaction loop. From a randomly-chosen
non-terminal start state, it picks an action via  random_policy , calls  env.step ,
records the  (state, reward)  pair, and continues until the episode terminates.
The trajectory only contains non-terminal states with the reward emitted
upon leaving them; the terminal state is never added because the loop
breaks before that.

mc_policy_evaluation  is the actual estimator. It walks each episode backwards
using the recursive definition of 
​. As it walks, it accumulates 
 for every
visited state into  returns_sum , and increments  returns_count . After all
episodes, it divides sum by count for each state and returns the resulting
value table.
Note: This is every-visit MC, that is, if a state appears multiple times in an
episode, every visit contributes to the average. There is also a first-visit variant
that only counts the first occurrence per episode. Both converge to the same
limit, with slightly different finite-sample variance, and the implementation
differences are minor. We will not spend time on them here.
Both converge to v_π in the limit; they differ slightly in bias and variance for
finite samples, but the practical difference is small here.
Running the experiment
Finally let's instantiate the gridworld and run the experiment:
Gt
G



The  main  function instantiates the gridworld and runs MC at three scales: 100,
1,000, and 10,000 episodes. After each run it prints the resulting value table
rounded to two decimals.
Then, using the 10,000-episode estimates, it draws a heatmap with values
overlaid on each cell and saves it to disk.
👉
We use 
 (undiscounted) because the gridworld is episodic and every
episode terminates, so returns are bounded automatically. We seed the
random number generator at 42 for reproducibility.
Results
Running  python main.py  produces the following output:
γ = 1



A few observations from the output stand out for this experiment:
After only 100 episodes, the estimates are noisy. Some states have only been
visited a handful of times, so their averages are far from the truth. The
bottom-left corner shows 
, well below the expected value.
After 1,000 episodes, the structure has emerged. Cells adjacent to terminals
are around 
 or 
, the center cells lie between 
 and 
, and the
cells diagonally opposite from terminals are the most negative.
After 10,000 episodes, the picture gets quite clear. Cells one step from a
terminal at roughly 
, central cells at roughly 
 to 
, and the worst
cells (the two diagonally opposite from terminals) at roughly 
.
Additionally, a heatmap also gets saved:
−35.9
−13
−14
−17
−20
−14
−18
−20
−22



Here we have visualized our experiment. Here also we can see that the two
diagonally opposite cells from terminals are most negative.
This is concrete evidence that the definition 
 is computable. Given a policy
and an environment we can simulate, and estimate the value of every state to
any desired accuracy by running enough episodes. No closed-form solution
required, no knowledge of 
 assumed.
That wraps up the hands-on section. We have moved from "
​ is an expectation"
to a working implementation that produces concrete numbers.
With this we conclude the discussion for this chapter. In the upcoming chapters,
we will continue to build on the core ideas of RL, and explore concepts and their
implementations wherever applicable.
Conclusion
In this chapter, we explored the formal language that all of RL relies on.
vπ(s)
P
vπ

We started with the Markov property, the assumption that the future depends
on the past only through the present, and saw how it makes the problem
tractable while also being a modeling choice that depends on how we define the
state.
We then formalized the Markov decision process as a 5-tuple of states, actions,
transition function, reward function, and discount factor.
We distinguished episodic and continuing tasks, and defined the return $G_t$​.
We discussed the reward hypothesis, its centrality to the framework, and its
limits in real-world settings, where reward hacking is now a documented
practical concern.
We then introduced policies, both deterministic and stochastic. We defined the
state-value function and the action-value function​, and noted the relationship
between them.
Finally, we built a 4x4 gridworld from scratch and used Monte Carlo rollouts to
estimate 
​.
In the next chapter, we will continue to build on the core ideas of RL and learn
about the Bellman equation and dynamic programming methods.
vπ

The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
Or
If you wish to connect privately, feel free to initiate a chat here:
Published on May 3, 2026
Comments
Share

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Previous
Next
Foundations of Reinforcement Learning
Bellman Equations and Dynamic Programming

---

## Part 3: Bellman Equations and Dynamic Programming

*Source: `3-Bellman Equations and Dynamic Programming.pdf`*

RL Part 3: Bellman expectation and optimality equations, policy iteration, value iteration, and why
dynamic programming needs a model.
Recap
In the previous chapter, we formalized the agent-environment interaction as a
Markov decision process (MDP).
We began with the Markov property, which states that the future depends on the
past only through the present state. This is the assumption that makes the entire
framework tractable: once you know the current state, you can discard the
history.

Sign Out
Account

We then defined the MDP as a 5-tuple 
: states, actions, a
transition function, a reward function, and a discount factor.
We discussed episodic versus continuing tasks. We defined the return 
 as the
discounted cumulative reward, and explained how  controls the agent's far-
sightedness.
(S, A, P, R, γ)
Gt
γ

We introduced policies, both deterministic and stochastic, as the object the agent
learns. We defined the state-value function 
 as the expected return from
state  under policy , and the action-value function 
 as the expected
return from taking action  in state  and then following .
vπ(s)
s
π
qπ(s, a)
a
s
π

Finally, we built a 4×4 gridworld and used Monte Carlo rollouts to estimate 
for a random policy.
vπ



If you have not read Chapter 2, we recommend doing so first:
Introduction
In Chapter 2, we computed 
 by running thousands of episodes and averaging
the returns.
Recall that 
 tells us how much total reward the agent can expect to collect
starting from state  if it follows policy .
In Part 2, we estimated this the brute-force way. Drop the agent into a state, let it
act until the episode ends, write down the total reward, and do that thousands
of times. Average those numbers and you get 
.
Markov Decision Processes and Value Functions
RL Part 2: Markov decision processes, returns, policies, and value functions.
Daily Dose of Data Science • Avi Chawla
vπ
vπ(s)
s
π
vπ(s)

The approach works, but it is expensive and noisy. Each estimate is a sample
average, and the variance shrinks slowly.
There is a more direct route. The value functions satisfy recursive equations
that relate the value of a state to the values of its successor states. These are the
Bellman equations, named after Richard Bellman, who introduced the principle
of optimality and the method of dynamic programming and compiled them into
his landmark 1957 book "Dynamic Programming" (Princeton University Press).

Richard E. Bellman
The Bellman equations give us two things. First, they characterize 
 and 
exactly, without simulation. Second, they characterize the optimal value
functions 
 and 
, which tell us the best possible performance in the
environment.
Dynamic programming (DP) turns these equations into algorithms. Given a
complete model of the environment (the transition function 
 and the reward
function 
), DP computes optimal policies exactly and efficiently for small
problems.
vπ
qπ
v∗
q∗
P
R

In this chapter, we will derive the Bellman expectation equations for 
 and 
,
then the Bellman optimality equations for 
 and 
.
We will also study four DP components: policy evaluation, policy improvement,
policy iteration, and value iteration. We will close with a hands-on project,
running both policy iteration and value iteration on the 4×4 gridworld and
comparing the results side by side.
Let's begin!
The Bellman expectation equation for 
In Chapter 2, we established the recursive structure of the return:
vπ
qπ
v∗
q∗
vπ

If this looks unfamiliar, 
 is just the return, the total (discounted) reward the
agent collects from time step  onward.
We defined it in Part 2 as described above. The recursive version above says that
the total reward is whatever you get right now, plus  times everything you get
after that.
The state-value function is the expected return from state  under policy :
As we covered in Part 2, this expectation accounts for two kinds of randomness:
→ The agent might act randomly (because  can be stochastic)
→ The environment might respond randomly (because 
 can be stochastic).
The value 
 averages over both.
Gt
t
γ
s
π
π
P
vπ(s)

Substituting the recursive return into this expectation and expanding gives us
the Bellman expectation equation for 
. The derivation proceeds in a few steps:
1. Starting from the definition, we substitute the recursive return:
2. Expectation is linear, so we can split it:
vπ

3. Now we need to expand these expectations. The agent is in state  and
selects action  according to 
. The environment then transitions to
state 
 with probability 
 and emits reward 
. Expanding
over actions and next states:
This is the Bellman expectation equation for 
.
Let us unpack everything here:
s
a
π(a|s)
s′
P(s′|s, a)
R(s, a, s′)
vπ

is the value of state  under policy .
The outer sum runs over all actions  available in , each weighted by
, the probability the policy assigns to that action.
The inner sum runs over all possible next states 
, each weighted by
, the transition probability. Inside the brackets, 
 is the
immediate reward for the transition, and 
 is the discounted value of
the successor state.
👉
This equation requires knowing 
 and 
.
The structure has two layers. The outer layer averages over the agent's action
choice (governed by ). The inner layer averages over the environment's
response (governed by 
). The term in brackets combines the immediate
reward with the future value, discounted by .
vπ(s)
s
π
a
s
π(a|s)
s′
P(s′|s, a)
R(s, a, s′)
γ vπ(s′)
P
R
π
P
γ

Backup diagram for 
The intuition is that the value of a state equals the average immediate reward
plus the average discounted value of wherever you end up next, where
"average" accounts for both the policy's randomness and the environment's
randomness. If 
, only the immediate reward matters. If 
, the future
matters as much as the present.
👉
Diagrams like the one just above are called backup diagrams. They show
value information flow during learning updates. In other words, they
vπ
γ = 0
γ = 1

illustrate how information from future states (or state-action pairs) is
passed back to earlier states when the agent updates its estimates.
Open circles = states, filled circles = state-action pairs, lines = actions from
a state, or next-states from an action.
A concrete example
Consider a tiny two-state MDP to see the equation at work:
State A has two actions:
go-left (stays in A)
go-right (moves to terminal state B).
The policy  is: 
, 
. Every transition gives a
reward 
. Transitions are deterministic. The discount factor is 
.
Since B is terminal, 
. For state A, the Bellman equation gives:
π
π(left|A) = 0.5 π(right|A) = 0.5
−1
γ = 0.9
vπ(B) = 0

The first term covers go-left: reward 
, then back to A. The second covers go-
right: reward 
, then terminal. Solving:
Under this policy, the agent expects about 
 in total return from state A.
The negative value reflects the 
 cost per step and the 50% chance of looping.
If the policy always went right, the value would be simply 
: one step, one
reward, done.
−1
−1
−1.82
−1
−1

👉
For larger state spaces, the circular dependencies become a system of
simultaneous equations. Iterative methods (covered later) handle these
efficiently without explicit matrix inversion.
Now let's go ahead and understand the Bellman expectation equation for 
.
qπ

The Bellman expectation equation for 
The same recursive logic applies to the action-value function. Recall that
 is the expected return from taking action  in state  and then following
 forever after.
We introduced 
 alongside 
 in Part 2.
The difference is small but important.
With 
, the agent picks its first action from  like any other step.
With 
, we force the first action to be  and only follow  from the
next step onward.
This is important because if you know 
 for every action, picking the best one is
trivial. You can just take 
 and no model of the environment is
needed.
qπ
qπ(s, a)
a
s
π
qπ
vπ
vπ(s)
π
qπ(s, a)
a
π
qπ
arg maxa qπ(s, a)

The Bellman expectation equation for 
 is:
Here,
 is the value of taking action  in state  under .
The outer sum runs over next states 
, weighted by the transition
probability 
.
Inside the brackets, 
 is the immediate reward.
The inner sum runs over actions 
 the agent might take in the successor
state 
, weighted by 
, multiplied by 
.
The structure mirrors the 
 equation but starts one step later. Since the first
action is already pinned to , the first layer averages over the environment's
transition. The second layer, inside 
, averages over the policy's next action
choice.
qπ
qπ(s, a)
a
s
π
s′
P(s′|s, a)
R(s, a, s′)
a′
s′
π(a′|s′)
qπ(s′, a′)
vπ
a
s′

Backup diagram for 
Now, as we know from chapter 2, the two value functions are linked as:
qπ

We derived this relationship in Part 2. It says something intuitive that the value
of a state is just the weighted average of the action values, where the weights
come from the policy.
Think of 
 as the overall grade for a state, and 
 as the grade for each
individual action you could take there.
Moving on, the value of a state is the policy-weighted average of the action
values. And from the Bellman equation for 
, we can also write:
These two relationships interlock: 
 can be expressed in terms of 
, and 
 in
terms of 
. This interlocking structure will become important when we define
optimality.
vπ
qπ
qπ
vπ
qπ
qπ
vπ

Optimal value functions and the Bellman optimality
equation
So far, the Bellman equations describe the value of following a specific policy .
But the agent's goal is not to evaluate one policy. It is to find the best one. This
brings us to the concept of optimal value functions.
Optimal policy and optimal value functions
A policy  is defined to be better than or equal to policy 
 if 
 for
all states . An optimal policy, written 
, is one that is at least as good as every
other policy.
For finite MDPs, at least one optimal policy always exists. There may be several,
but they all share the same value functions.
Up to this point, both in Part 2 and earlier in this chapter, every value we have
looked at has been tied to one specific policy . Change the policy, and the values
change.
The natural next question is → what if we could pick the best policy? What is the
highest value any state could ever have?
π
π
π′
vπ(s) ≥vπ′(s)
s
π∗
π

The optimal state-value function 
 is defined as:
 is the maximum expected return achievable from state  over all possible
policies. Similarly, the optimal action-value function 
 is:
 is the maximum expected return from taking action  in state  and
behaving optimally thereafter.
👉
Once you know 
, the optimal policy is trivial. Just pick:
v∗
v∗(s)
s
q∗
q∗(s, a)
a
s
q∗
arg
​q
​(s, a)
a
max
∗

in every state. No model needed, no lookahead needed. This is why
estimating 
 is the central goal of many RL algorithms.
The Bellman optimality equation for 
Because an optimal policy selects the best action in every state, the Bellman
equation for 
 replaces the policy-weighted average with a maximum over
actions.
The Bellman optimality equation for 
 is:
Let us unpack this:
 is the optimal value of state .
 selects the action that yields the highest value.
q∗
v∗
v∗
v∗
v∗(s)
s
maxa

Backup diagram for 
👉
The key structural difference: the Bellman expectation equation is linear
(weighted sum over actions), so it can be solved by linear algebra. The
Bellman optimality equation is non-linear (because of the max), so it
cannot. This is why we need iterative algorithms.
The Bellman optimality equation for 
v∗
q∗

The Bellman optimality equation for 
 is:
Here,
 is the optimal value of taking action  in state .
Sum runs over next states.
 is the discounted optimal value from the successor,
obtained by taking the best action 
 in 
.
q∗
q∗(s, a)
a
s
γ maxa′ q∗(s′, a′)
a′
s′

Backup diagram for 
The relationship between 
 and 
 is:
q∗
v∗
q∗

The optimal value of a state is the value of the best action in that state.
👉
Solving the Bellman optimality equations gives 
 and 
 directly, from
which the optimal policy follows immediately. The entire RL problem, in
principle, reduces to solving these equations. The difficulty is that solving
them exactly requires a complete model and becomes computationally
intractable for large state spaces.
In summary, we now have four Bellman equations: two expectation equations
(for 
 and 
) and two optimality equations (for 
 and 
).
The expectation equations describe what happens under a given policy. The
optimality equations describe the best possible behavior. DP algorithms exploit
v∗
q∗
vπ
qπ
v∗
q∗

these equations to compute optimal policies.
From equations to algorithms: dynamic programming
The Bellman equations are mathematical identities. They describe relationships
that the true value functions satisfy. But they are not algorithms. Dynamic
programming turns them into iterative update rules that converge to the
solution.
DP requires a complete and accurate model of the environment: the full
transition function 
 and reward function 
 for every state-action pair. This
places DP firmly in the model-based setting.
The core idea of DP is simple: use the Bellman equations as update rules. Start
with an arbitrary estimate of the value function. Sweep through all states,
updating each one according to the Bellman equation. Repeat until the estimates
converge.
There are four components we will cover:
P
R

policy evaluation (compute 
 for a given )
policy improvement (derive a better  from 
)
policy iteration (alternate the two until convergence)
value iteration (combine them into a single update)
Policy evaluation
Policy evaluation answers the question: given a fixed policy , what is 
? This
is also called the prediction problem, since we are predicting how much reward
the policy will accumulate.
The iterative update
The Bellman expectation equation for 
 is:
We turn this into an update rule. Start with an arbitrary initial estimate 
(typically all zeros). At each sweep , update every state:
vπ
π
π
vπ
π
vπ
vπ
v0
k

The left side is the new estimate. The right side uses the old estimates from the
previous sweep.
👉
One full pass through all states is called a sweep.

This update is a contraction mapping, i.e., the distance between 
 and the true
 shrinks by a factor of at most  with every sweep.
💡
Think of a contraction mapping like repeatedly squeezing a spring. No
matter how far you stretch it initially, each squeeze brings it closer to rest.
Here, the "rest position" is the true 
, and each sweep of the Bellman
update squeezes the gap by a factor of at most . Since 
, the gap
keeps shrinking and the estimates eventually settle on the correct values.
This guarantee comes from a result in mathematics called the Banach
fixed-point theorem.
Because 
 (or the task is episodic), the iterates converge to the unique fixed
point 
 as 
.
In practice, we stop when the maximum change across all states in a single
sweep falls below a small threshold :
vk
vπ
γ
vπ
γ
γ < 1
γ < 1
vπ
k →∞
θ

Algorithm
The full algorithm for iterative policy evaluation is:
The convergence rate depends on . With  close to 1, convergence is slow
because the contraction factor is close to 1. With  close to 0, convergence is fast
but the resulting value function only reflects near-term rewards.
γ
γ
γ

👉
The difference between the Bellman equation and the update rule is subtle
but crucial. The equation is a condition that the true 
 satisfies. The
update rule is an iterative algorithm that converges to 
. The equation
uses 
 on both sides. The update uses 
 on the right and produces 
on the left.
Policy improvement
Policy evaluation gives us 
 for a specific policy. The next question: can we use
 to find a better policy?
The greedy policy
Given 
, we construct a new policy 
 by acting greedily. For each state , pick
the action that maximizes the expected one-step lookahead:
vπ
vπ
vπ
vk
vk+1
vπ
vπ
vπ
π′
s

💡
Notice what this 
 needs the transition probabilities 
 and
the reward 
.
These are the same model components from the MDP 5-tuple
 we defined in Part 2. Without knowing them, we cannot do
this lookahead.
That is what makes this a model-based operation.
Later in the series, when we move to model-free methods, we will sidestep
this by working with 
 directly, which (as we saw in Part 2) absorbs the
dynamics into itself so the agent never needs to know 
.
The phrase "one-step lookahead" means we only optimize the current action,
then assume  takes over from the next state onwards.  is the action chosen
now. This is the one step we're optimizing.
So the full computation is: take action  once, then follow  for the rest of time.
The "step" being looked at is just the current one; everything after is handled by
 (baked into 
​).
arg max
P(s′|s, a)
R(s, a, s′)
(S, A, P, R, γ)
qπ
P
π
a
a
π
π
vπ

Notice that the expression inside the 
 is exactly 
. So the greedy
policy simply selects in every state:
The policy improvement theorem
Above we said "act greedily and you'll get a better policy", but how do we know
that's true? Could being greedy for one step somehow backfire later? The policy
improvement theorem answers this: greedy improvement is guaranteed to help,
never hurt.
In simple words, the theorem states: If, in every state , 
 's action is at least as
good as 's action (assuming we follow  afterwards), then 
 is at least as good
as  everywhere, even when used throughout.
Formally: if 
 for every state , then 
 for
every state .
arg max
qπ(s, a)
s π′
π
π
π′
π
qπ(s, π′(s)) ≥vπ(s)
s
vπ′(s) ≥vπ(s)
s

👉
When does improvement stop? When the greedy policy is the same as the
current policy: 
. In that case:
for all states, which is exactly the Bellman optimality equation. The policy
is optimal. So 
 and 
​.
Policy iteration
Policy iteration combines evaluation and improvement into a loop. Start with
any policy, evaluate it, improve it and repeat. The result is the optimal policy.
π′ = π
v
​(s) =
π
​q
​(s, a)
a
max
π
vπ = v∗
π = π∗

👉
Policy iteration is sometimes called "exact policy iteration" to distinguish it
from methods that truncate the evaluation step.
The cost of policy iteration lies in the evaluation step. Each evaluation runs the
iterative update until convergence, which can require many sweeps, especially
when  is close to 1.
This raises a question: do we really need exact evaluation before improving?
The answer is no, and this observation leads to value iteration.
Value iteration
Value iteration makes a simple observation: we do not need to wait for policy
evaluation to converge. We can truncate it to a single sweep and fold the
improvement step directly into the update.
The update rule
Value iteration combines the Bellman optimality equation into a single iterative
update:
γ

Compare this to the policy evaluation update, which uses a policy-weighted sum.
Value iteration replaces that sum with a 
. Each sweep simultaneously
evaluates and improves, because the 
 selects the best action at each state.
Policy iteration typically requires fewer outer iterations (improvement steps),
but each iteration is expensive because evaluation runs to convergence. Value
iteration requires more outer iterations (sweeps), but each is cheap: a single
pass through all states.
Which is faster depends on the problem. For small problems, policy iteration
often converges in very few improvement steps. For larger problems, value
iteration can be more practical because it avoids the cost of full evaluation.
👉
Both algorithms converge to the same 
 and 
. They differ only in how
they get there.
max
max
v∗
π∗

Note: After value iteration converges, we still need to extract the policy. We do
this for each state by computing:
This is a single pass, not an iterative process.
Now that we have a reasonable grasp of DP, let's examine one of its key
shortcomings beyond being model-based.
The curse of dimensionality in DP
Even with a model in hand, DP runs into a computational wall. Bellman himself
called this the "curse of dimensionality" (Bellman, 1957). The problem is that DP

sweeps every state on every iteration, and the number of states grows
exponentially with the number of state variables.
Consider a problem with  state variables, each taking  values. The total state
count is 
. For example, 2D gridworld has two state variables ( , ) and if each
has four values, that makes total states as 
. Similarly, with 
 and
, that gives a huge 
 count of states.
Thus, iterations and sweeps at such a huge scale becomes unimaginable.
d
n
nd
x y
42 = 16
d = 10
n = 100
1020

So what does DP give us?
Despite its limits, DP is foundational and also serves as a benchmark. For small
problems where it is tractable, it gives the exact optimal solution, against which
approximate methods can be measured.
Even with the curse of dimensionality, DP is far more efficient than brute-force
search over policies. The number of deterministic policies is 
,
astronomically larger than 
 for all but the smallest problems.
In summary, DP is the gold standard for small, known environments. It gives
exact answers through clean algorithms grounded in the Bellman equations. Its
practical limits, the need for a model and the curse of dimensionality, push us
toward model-free methods which we'll be studying later in the series.
💡
The model-free methods we will study later drop the need for 
 and 
entirely. The agent learns from experience alone, similar to how we used
Monte Carlo rollouts in Part 2 to estimate 
 without ever writing down
the transition function. The key difference is that the upcoming methods
will be far more sample-efficient than running thousands of episodes and
averaging.
|A||S|
|S|
P
R
vπ

We have now understood all the key concepts for this chapter. The pieces are in
place. So let's go ahead and dive into hands-on section for some practical
experimentation.
Hands-on: policy iteration and value iteration on a 4×4
gridworld
Here we will implement both policy iteration and value iteration on a 4×4
gridworld and compare the results.
Setup
The code and project setup are attached below as a zip file. You can extract it
and run uv sync  to get going.

Download the zip file below:
dp-gridworld
dp-gridworld.zip
For details about versions and dependencies, check the .python-version  and
pyproject.toml  files.
👉
It is recommended to follow the explanation ahead side-by-side with the
above attached project for a more comprehensive understanding.
The environment
• 40 KB

The grid has 16 cells. Two are terminal: 
 (top-left) and 
 (bottom-right).
The remaining 14 are non-terminal. Every transition gives reward 
.
Transitions are deterministic: the agent moves in the chosen direction unless it
would leave the grid, in which case it stays in place. We also use 
 to
show discounting.
Now let's look at the code:
(0, 0)
(3, 3)
−1
γ = 0.99



The GridWorld class is nearly identical to the one in Chapter 2, with one change:
we removed the reset  method and the episode-running logic. DP does not need
to simulate episodes. It works directly with the transition function. The step
method serves as that function: given a state and action, it returns the
deterministic next state and reward.
A few details about the implementation:
States are stored as flat indices 0 through 15. The state_to_rc  and rc_to_state
methods convert between flat indices and (row, column) coordinates.
Terminal states return reward 0 and transition to themselves. Non-terminal
states always return reward 
.
Wall collisions are handled by clamping: if the move would go off the grid,
the agent stays in place.
−1

The DP algorithms
Dynamic programming algorithms for the gridworld: iterative policy evaluation,
policy improvement, policy iteration and value iteration.
First let's take a look at policy evaluation and improvement:



Let us walk through each one:
policy_evaluation  implements the iterative Bellman update for a fixed
deterministic policy:
It initializes 
 to zeros, then sweeps through all non-terminal states.
For each state, it applies the Bellman update: 
,
where 
 is the single next state under the deterministic policy.
The function tracks the maximum change ( delta ) across each sweep
and stops when it falls below theta .
It returns the converged value function and the number of sweeps.
V
V (s) ←R + γ V (s′)
s′

👉
Because the transitions are deterministic and the policy is deterministic,
the inner sum over next states collapses to a single term, which is why the
update is a simple assignment rather than a weighted sum.
policy_improvement  constructs the greedy policy with respect to a given value
function. For each non-terminal state, it computes the one-step lookahead
value for all four actions (up, right, down, left) and picks the action with the
highest value. This is the 
 operation from the theory.
Now let's take a look at policy iteration and value iteration:
arg max



Here:
policy_iteration  glues evaluation and improvement together. It starts with
the all-up policy (action 0 for every state), evaluates it, improves it, and

repeats until the policy stops changing. It tracks the total number of
evaluation sweeps across all iterations.
value_iteration  implements the Bellman optimality update. Each sweep
applies 
 for every non-terminal state. After
convergence, it extracts the greedy policy in a single final pass.
Running the experiment
Finally, let's instantiate the gridworld and run the experiment:
V (s) ←maxa[R + γV (s′)]



The main script instantiates the gridworld with 
, runs both algorithms,
and compares the results. It also generates a side-by-side visualization with
value heatmaps and policy arrow plots.
Results
Running python main.py  produces the following output:
γ = 0.99



Several observations from these results:
Both algorithms converge to the same optimal value function and the same
optimal policy. The max difference between their value functions is exactly
zero, and the policies are identical. This confirms the theory: both
algorithms find the same 
 and 
.
v∗
π∗

The optimal policy is intuitive. Every state points toward the nearest
terminal.
The iteration counts tell a revealing story:
Policy iteration needed only 4 improvement steps to converge, but those
4 steps required 5,506 total evaluation sweeps. The evaluation phase
dominates the cost, because 
 makes convergence slow.
Value iteration, by contrast, converged in just 4 sweeps. This is because
the gridworld is small and has short optimal paths (at most 6 steps from
the farthest state to a terminal). The max operator propagates optimal
values faster than the policy-weighted average.
γ = 0.99

A plot is also saved that visualizes the comparison:

The heatmaps show the symmetric structure of 
: the grid is symmetric about
the diagonal from 
 to 
. The policy arrows confirm that every state
routes the agent toward the nearest terminal.
That wraps up the hands-on section. With this we conclude the discussion for
this chapter. In the upcoming chapters, we will continue to build on the core
ideas of RL, and explore concepts and their implementations wherever
applicable.
Conclusion
In this chapter, we explored the recursive structure at the heart of
reinforcement learning.
We looked at the Bellman expectation equations for 
 and 
, showing that the
value of a state decomposes into the immediate reward plus the discounted
value of the successor. We then saw the Bellman optimality equations for 
 and
, which replace the policy average with a max over actions, characterizing the
best achievable performance.
v∗
(0, 0)
(3, 3)
vπ
qπ
v∗
q∗

We studied four DP components:
Policy evaluation iteratively computes 
 for a given policy.
Policy improvement constructs a greedy policy from 
, guaranteed to be at
least as good by the policy improvement theorem.
Policy iteration alternates the two until convergence to 
.
Value iteration merges evaluation and improvement into a single update,
using the Bellman optimality equation directly.
We examined the limitations of DP: it requires a complete model of the
environment and faces the curse of dimensionality for large state spaces. These
constraints motivate the model-free methods.
Finally, we built a concrete implementation of both policy iteration and value
iteration on the 4×4 gridworld and saw them converge to the same optimal
policy and value function, while differing in computational cost.
In the next chapter, we will move beyond the model-based assumption and
explore model-free learning.
vπ
vπ
π∗

The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
Or
If you wish to connect privately, feel free to initiate a chat here:
Published on May 10, 2026
Comments
Share

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Previous
Next
Markov Decision Processes and Value Functions
Model-Free Learning

---

## Part 4: Model-Free Learning

*Source: `4-Model-Free Learning.pdf`*

RL Part 4: Learning value functions and policies without a model. Monte Carlo methods, TD(0),
SARSA, Q-learning, and the bias-variance bridge between them.
Recap
In the previous chapter, we explored the recursive structure that sits at the heart
of reinforcement learning: the Bellman equations.
We started with the Bellman expectation equations for 
 and 
. We saw that
the value of a state, under a fixed policy, equals the expected immediate reward
plus the discounted value of the next state. The equations gave us a way to
characterize 
 and 
 exactly, without simulation.

vπ
qπ
vπ
qπ
Sign Out
Account

We then derived the Bellman optimality equations for 
 and 
. These replaced
the policy-weighted average with a 
 over actions, characterizing the best
achievable performance in the environment.
We then turned these equations into algorithms via dynamic programming (DP):
policy evaluation, policy improvement, policy iteration, and value iteration.
v∗
q∗
max

Finally, we ran both policy iteration and value iteration on a 4×4 gridworld and
confirmed they converged to the same optimal policy.

If you have not read Chapter 3, we recommend doing so first:

Introduction
DP gave us the gold standard for small, fully known MDPs. The catch is that real
environments rarely hand us a clean 
 and 
.
What we usually do have is something else: an agent that can interact with the
environment, take actions, and observe rewards and next states. The question
for this chapter is how to estimate value functions and learn good policies
purely from this kind of experience, without any access to 
 or 
.
This is the model-free setting.
We will look at two foundational families:
Bellman Equations and Dynamic Programming
RL Part 3: Bellman expectation and optimality equations, policy iteration,
value iteration, and why dynamic programming needs a model.
Daily Dose of Data Science • Avi Chawla
P
R
P
R

Monte Carlo (MC) methods, which learn from full episodes of experience.
Temporal-difference (TD) methods, which learn from single transitions by
using their current estimates to update themselves.
From there, we will move to TD-based control: SARSA and Q-learning, and close
with an experiment that contrasts the two.
Let's begin!
What model-free actually means?
Although we briefly introduced the idea of model-free learning in Chapter 2, it is
worth revisiting now. A helpful way to contextualize the term is by contrasting it
with the methods explored in Chapter 3.
In DP, we plugged 
 and 
 directly into the Bellman update. The agent never
had to do anything. We computed 
 or 
 by sweeping over the state space and
applying the equations. There was no interaction with the environment, no
P
R
vπ
v∗

episodes to play out and no exploration to manage. We treated the environment
as a known mathematical object.
In model-free RL, we do not have 
 or 
. We have an agent that can be placed
in a state, take an action, and observe the resulting next state and reward. From
these samples, we estimate value functions and improve policies. The
environment is treated as a black box.
P
R

👉
Important: "Model-free" does not mean no model exists. The environment
has dynamics, of course. It means the algorithm does not require access to
those dynamics.
Two organizing axes will run through the rest of the chapter:
The first is prediction versus control. Prediction is the task of estimating 
or 
 for a given fixed policy. Control is the task of finding a good policy.
👉
Most algorithms in this chapter are introduced in their prediction form
first because the math is cleaner, then extended to control.
The second axis is on-policy versus off-policy. An on-policy method learns
about the same policy it uses to generate behavior. An off-policy method can
learn about one policy (the target policy) while behaving according to
another (the behavior policy).
So now, let's dive into understanding the various model-free techniques.
vπ
qπ

Monte Carlo prediction
We know that the value of a state under a policy is, by definition, the expected
return when starting from that state and following the policy:
If you cannot compute this expectation analytically (because you do not know 
), you can still estimate it by sampling, by running many episodes. Every time
the agent visits state , record the return that followed. The average of those
returns is your estimate of 
.
By the law of large numbers, as the number of visits to  goes to infinity, the
sample average converges to the true expected return. No model required.
👉
This means run more episodes, the average tightens. There is nothing
more to it than that.
P
s
vπ(s)
s

First-visit and every-visit MC
When state  appears more than once in the same episode, we have a choice:
First-visit MC averages the return only from the first time  is visited in each
episode.
Every-visit MC averages the return from every visit, treating each one as an
independent sample.
Both are valid. Both converge to 
 as the number of episodes grows. First-
visit MC has a longer history of theoretical analysis and every-visit MC tends to
be simpler to implement and converges similarly in practice.
👉
MC methods are defined for episodic tasks only. The return 
 has to
actually be computable, which means the episode has to end. Continuing
tasks (no terminal state) cannot be handled directly by basic MC.
Incremental updates
Computing the average naively is wasteful. We can avoid this by maintaining an
efficient running mean.
s
s
vπ(s)
Gt

For a state  with visit count 
 and current estimate 
, the update after
observing a new return 
 is:
Here:
 is the running estimate
 is the new return observed for this visit
 is the number of times  has been visited so far.
The bracketed term 
 is the prediction error: how much the new
sample disagrees with the current estimate. We move the estimate a
fraction 
 of the way toward the new sample.
The structure has a clean interpretation. Each new return nudges the estimate
toward the truth. The step size 
 shrinks as visits accumulate, so later
s
N(s)
V (s)
G
V (s)
G
N(s)
s
G −V (s)
1/N(s)
1/N(s)

samples have less and less effect. In the limit, the estimate stops moving and we
have the exact sample mean.
In practice, however, we often replace 
 with a constant step size :
Typically, 
. This trades exact convergence for the ability to track non-
stationary value functions, where older returns become less relevant.
Now, one last note before we move to control. Everything we said about MC
prediction for 
 extends naturally to 
.
Also, similar to 
, we can replace 
 with a constant step size .
1/N(s)
α
α ∈(0, 1]
V
Q
V
1/N(s, a)
α

Monte Carlo control
Prediction estimates 
 for a given . Control is the harder problem: finding a
good policy. The natural template, inherited from DP, is the concept of policy
iteration: alternate evaluation with improvement.
That requires 
 and 
. Without them, 
 alone is not enough to derive a greedy
policy.
But the solution is also something that we already know. Notice that the
expression inside the 
 is exactly 
. So the fix is to estimate the
action-value function 
 directly.
vπ
π
P
R
vπ
arg max
qπ(s, a)
qπ(s, a)

Now once we have 
, the greedy policy is just:
This needs no model and no lookahead, which is why action-value functions
dominate model-free RL.
qπ

But there is still a snag, the exploration-exploitation misbalance this brings
about.
The exploration problem
If we follow a deterministic greedy policy from the start, many state-action pairs
will never be visited. Without visits, we never get returns, never update 
, and never discover that some action might actually be better than what we
currently believe.
qπ(s, a)

The greedy policy locks us into whatever happened to be best in our initial
estimates, which were arbitrary.
This is the exploration problem in MC control. There are two classical solutions:
Exploring starts assumes every state-action pair has a non-zero probability
of being the start of an episode. Sample the initial state and action
uniformly, then follow the policy thereafter. Mathematically clean; but
practically, it requires being able to reset the environment to any state-
action pair, which is rare in real problems.
-greedy and -soft policies keep exploration baked into the policy itself.
With probability 
, take the greedy action; with probability , take a
random action. The policy is "soft" because every action has some
probability of being chosen in every state, so all state-action pairs
eventually get visited.
👉
The -greedy approach is the standard in practice. It is dead simple,
requires no special environment access, and gives a tunable knob for the
exploration-exploitation trade-off.
ε
ε
1 −ε
ε
ε

Now that we have a reasonable grasp of Monte Carlo methods, let's examine
their shortcomings.
Limits of Monte Carlo
MC is conceptually clean but has structural limits:
Episodic-only: The return 
 is only defined when the episode ends. In tasks
that go on indefinitely, MC has no natural target to update toward.
Wait: Even in episodic tasks, MC has to play out the entire episode before
any state's value can be updated. If an episode lasts thousands of steps,
every state in it sits stale until the very end.
Variance: The return 
 accumulates
randomness from every step. Two episodes starting from the same state can
produce wildly different returns because of the cumulative noise. High
variance in the target means many samples are needed before the average
settles.
Gt
Gt = Rt+1 + γRt+2 + γ2Rt+3 + ⋯

These three problems all have a common root: MC commits to the actual full
return as its update target. What if we used a shorter target, one that only goes
one step into the future and then bootstraps?
That is exactly the TD idea.
Temporal-difference learning: TD(0)
Temporal-difference learning, introduced by Sutton in his 1988 paper "Learning
to Predict by the Methods of Temporal Differences", is the central idea that
makes most modern RL work.
The setup is the same as MC prediction: we have a fixed policy  and we want to
estimate 
. The change is in the target. Instead of waiting for the full return 
,
we use a one-step target that combines the immediate reward with the current
estimate of the next state's value.
π
vπ
Gt

The TD(0) update is:

Let's unpack this carefully:
 is our current estimate of the value of the state we just left, 
.
 is the reward we observed on the transition.
 is our current estimate of the value of the state we landed in.
 is the discount factor.
 is the step size.
The quantity 
 is called the TD target. It is a one-step
approximation of the full return: take the actual reward, then use the value
estimate to stand in for the rest of the return after that.
The bracketed term 
 is called the TD error, often
denoted 
. It measures how surprising the transition was: how much the new
evidence (one step of reward plus the value of where we ended up) disagrees
with our current estimate of where we started.
TD as a fusion of MC and DP
TD sits between MC and DP, taking one good idea from each:
V (St)
St
Rt+1
V (St+1)
γ
α
Rt+1 + γV (St+1)
Rt+1 + γV (St+1) −V (St)
δt

From MC, it inherits the model-free property: the update only uses observed
transitions. No knowledge of 
 or 
 required.
From DP, it inherits bootstrapping: the update uses an existing estimate
 as part of the target. This is what lets TD update online, after every
single step, without waiting for the episode to end.
The result is a method that works on continuing tasks and updates online.
P
R
V (St+1)

Bias and variance: MC vs TD
The MC vs TD comparison is one of the most useful conceptual handles in RL.
The difference is best framed in terms of bias and variance of the update target.
MC bias and variance:
The MC target is the actual return 
. Because 
 is, by definition, a sample
from the true return distribution under , its expectation is exactly 
.
The MC target is unbiased.
But 
 is the sum of many random rewards. Each step adds its own noise,
and the noise compounds. Two episodes from the same state can yield very
different 
 values. The MC target has high variance.
TD bias and variance:
The TD target is 
. Only one reward enters; the rest of the
return is replaced by the current value estimate. Variance is much lower
because we are summing over far less randomness.
Gt
Gt
π
vπ(St)
Gt
Gt
Rt+1 + γV (St+1)

But 
 is just an estimate, almost certainly wrong, especially early in
training. The TD target uses a guess in place of the truth. The TD target is
biased.
So we have a clean trade-off:
MC: unbiased, high variance.
TD(0): biased, low variance.
A concrete way to see the variance gap: suppose every reward in an episode is
an independent random variable with variance 
, and the episode is 
 steps
long. The MC return 
 has variance roughly 
 (ignoring discounting). The
TD target uses one reward and a value estimate, so its variance is roughly 
plus some smaller estimate-related term. For long episodes, that is a difference
of an order of magnitude or more.
V (St+1)
σ2
T
Gt
Tσ2
σ2

👉
In practice, on tabular tasks, TD(0) typically converges faster than
constant-  MC.
SARSA: on-policy TD control
α

Before we take a look at SARSA, let's briefly look at what is meant by "on-policy".
The definition is, the policy being learned is the same as the policy generating
the data.
👉
This in simpler terms means, on-policy means you can only learn from
your own decisions. If you didn't make the choice yourself, you can't use it
to improve.
Now whatever we saw about TD so far has been a prediction method. To turn it
into a control method, we make the same shift we did with MC: estimate action
values 
 instead of state values 
, and act greedily (or -greedily) with
respect to 
.
The SARSA update is:
Q(s, a)
V (s)
ε
Q

Here, 
 and 
 are the state and action at time , 
 and 
 are the
observed reward and next state, and 
 is the action selected by the current
policy at 
.
The structure mirrors TD(0) for 
, but every term is now an action-value. The
TD target 
 uses the value of the actual action that the
policy actually took at the next state.
👉
The name "SARSA" comes from the tuple of variables that appears in the
update: 
.
St
At
t Rt+1
St+1
At+1
St+1
V
Rt+1 + γQ(St+1, At+1)
(St, At, Rt+1, St+1, At+1)

The algorithm flow is straightforward:
Select 
 from the current -greedy policy on 
, take the action.
At
ε
St

Observe 
 and 
, select 
 from the same -greedy policy on 
,
then apply the update.
Notice that the update needs 
 before it runs, this means SARSA picks
the next action first and then updates.
👉
A subtle point worth flagging: when an episode terminates after the
transition from 
, there is no 
 to bootstrap from. The standard
convention is to treat the value of the terminal state as zero, so the target
collapses to just 
.
Q-learning: off-policy TD control
Off-policy methods break the coupling between the policy generating data and
the policy being learned about. Two distinct policies are involved:
Behavior policy: the policy the agent actually follows to interact with the
environment and generate experience. This is often exploratory, such as an
ε-greedy policy.
Rt+1
St+1
At+1
ε
St+1
At+1
St
St+1
Rt+1

Target policy: the policy the agent is trying to learn. This is the policy whose
value function ultimately matters, and it is often the greedy policy with
respect to 
.
Now coming back to the topic, Q-learning is the pivotal algorithm of classical RL
and is the seed of an enormous fraction of modern deep RL.
The Q-learning update is:
The only change from SARSA is in the bootstrap term. SARSA uses
, the value of the action the policy actually picks. Q-learning uses
, the value of the best action available at the next state,
regardless of what the policy picks.
That single change makes Q-learning off-policy. The update target reflects the
greedy (optimal) policy, not the behavior policy used to collect the data. The
agent can explore however it likes, and the Q-values it learns will still be
approaching 
.
Q
Q(St+1, At+1)
maxa Q(St+1, a)
q∗

This is a remarkable property. It means we can run an exploratory -greedy
behavior policy, collect data, and update toward the values of the optimal
greedy policy at the same time.
Now that we know Q-learning's 
 operator is what gives it off-policy power.
It is also what introduces a problem called maximization bias: taking the max
over noisy estimates tends to overestimate the true max.
ε
max

A brief note on maximization bias
Suppose we have several actions whose true Q-values are all equal, but our
estimates of those Q-values are noisy. The max of noisy estimates is, in
expectation, larger than the max of true values, because the max operator
preferentially picks whichever action happened to be overestimated.
The Q-learning target inherits this bias every time it computes 
.
The bias is small in benign environments and vanishes as estimates tighten, but
in stochastic or noisy domains, it can meaningfully delay convergence. SARSA,
which uses a sampled action rather than a max, does not suffer from this
problem in the same way.
Another practical consequence-based difference in SARSA and Q-learning: if
exploration is dangerous, SARSA and Q-learning learn different policies.
👉
SARSA's policy is shaped to avoid the danger that the explorative nature of
its policy actually creates; Q-learning's policy is the optimal one as if
exploration didn't exist, even though the agent is still explores.
maxa Q(St+1, a)

For example, imagine teaching a robot to drive a narrow path with a ditch on
either side. SARSA's policy would steer toward the middle of the path because,
factoring in the robot's noisy steering, the middle is the safest place to be. Q-
learning's policy would steer right at the edge of the path because, assuming
perfect steering, the edge is fastest. Both policies are correct under their own
assumptions. The choice between them depends on whether the noise that the
agent uses to explore is also the noise the deployed policy will face.
We have now understood all the key concepts for this chapter. The pieces are in
place. So let's go ahead and dive into hands-on section for some practical
experimentation.
Hands-on: SARSA vs Q-learning on Cliff Walking
We will now walk through a standard experiment for demonstrating the SARSA-
vs-Q-learning behavioral difference on a small gridworld called "Cliff Walking".
Setup

The code and project setup are attached below as a zip file. You can extract it
and run  uv sync  to get going.
Download the zip file below:
cliff-walking
cliff-walking.zip
For details about versions and dependencies, check the  .python-
version  and  pyproject.toml  files.
• 37 KB

👉
It is recommended to follow the explanation ahead side-by-side with the
above attached project for a more comprehensive understanding.
The environment
Cliff Walking is a 4×12 gridworld. The agent starts at the bottom-left cell. The
goal is the bottom-right cell. The bottom row between them is a cliff of 10 cells.
Every step gives a reward of 
. Stepping into the cliff gives 
 and resets
the agent to the start (without ending the episode). The episode ends when the
agent reaches the goal. There are four actions: up, right, down, and left.
The state space has 48 cells, encoded as flat indices: state 
.
Start is state 36 (row 3, col 0), goal is state 47 (row 3, col 11), cliff cells are states
37 through 46.
To get a feel for the dynamics, the optimal trajectory under perfect (zero-
exploration) play is: from state 36, move UP to state 24, then RIGHT eleven times
along row 2 to state 35, then DOWN to state 47. That is 13 steps. Any path that
goes higher up the grid (rows 0 or 1) trades off speed for safety: under -greedy,
−1
−100
= row × 12 + col
ε

a random action on row 1 is much less likely to plunge the agent off the cliff
than the same random action on row 2.
SARSA implementation
SARSA agent and training loop:



The agent stores a Q-table of shape 
, initialized to zero. Action selection is
-greedy: with probability  pick a random action, otherwise pick
. The update applies the SARSA rule from earlier in the
chapter.
A few details about the implementation:
The training loop chooses the next action before updating 
, because
SARSA's target needs 
 from the current policy.
When the episode terminates, the bootstrap term is dropped: the target is
just the observed reward, since there is no successor state.
Q-learning implementation
Q-learning agent and training loop:
(48, 4)
ε
ε
arg maxa Q(s, a)
Q(s, a)
At+1



The Q-learning agent has the same shape: a Q-table, -greedy action selection,
the same handling of episode termination. The single meaningful difference is in
the update: instead of using 
 for the next action 
 chosen by the policy,
it uses 
.
In the training loop, this difference shows up in a small but consequential way:
Q-learning does not need to know the next action when updating 
. The
action selection happens fresh each loop iteration. SARSA, because it needs 
, has to pre-select the next action and carry it through the loop.
Running the experiment
Experiment driver code:
ε
Q(s′, a′)
a′
maxa Q(s′, a)
Q(s, a)
At+1



We run both algorithms with identical hyperparameters: 
, 
,
, 500 episodes per run, 10 independent runs per algorithm.
The experiment has three steps:
α = 0.5 γ = 1.0
ε = 0.1

For each of 10 random seeds, train SARSA and Q-learning from scratch and
record the total reward per episode.
Average the per-episode rewards across the 10 runs for both algorithms,
then smooth with a 10-episode moving average for plotting.
For one representative seed, extract the greedy policies and visualize them
on the grid.
Results
Running python main.py  produces:
SARSA accumulates roughly half the negative reward of Q-learning during
training. Q-learning falls off the cliff regularly because of -greedy exploration,
while SARSA learns to stay away from the edge.
ε

The plot above also conveys the same pattern.
Now the policies tell the rest of the story:

SARSA's greedy policy from the start cell goes UP (away from the cliff), then
traverses the top of the grid, then DOWN to the goal. The path is longer but safer
under -greedy: even if exploration takes a random action, the agent is two rows
away from the cliff and recovers.
Q-learning's greedy policy from the start cell goes UP one row, then RIGHT all
the way along row 2 (the row just above the cliff), then DOWN. This is the
optimal path. But under -greedy training, the agent is constantly one wrong
ε
ε

action away from falling off, and that is exactly why its training reward is worse
despite finding the better policy.
That wraps up the hands-on section. With this, we conclude the discussion for
this chapter. In the upcoming chapters, we will continue to build on the core
ideas of RL and explore concepts and their implementations wherever
applicable.
Conclusion
In this chapter, we explored model-free learning: how to estimate values and
learn policies without access to the environment dynamics.
We started by clarifying what model-free actually means: not the absence of
dynamics, but the absence of access to them in the algorithm. We laid out two
organizing axes: prediction versus control, and on-policy versus off-policy.
We covered Monte Carlo prediction and saw the first-visit and every-visit
variants, the incremental update, and the constant-  generalization. We then
α

extended MC to control: shifting from 
 to 
, handling exploration via -greedy.
We saw the structural limits of MC: episodic-only, must wait for episode end,
high variance per update. These motivated TD(0) learning, where the update
target combines one observed reward with a bootstrapped value estimate of the
next state.
From TD prediction, we moved to TD control:
SARSA is on-policy and uses the value of the actually taken next action in its
target.
Q-learning is off-policy and uses the max over next actions.
Finally, the Cliff Walking experiment made the on-policy / off-policy distinction
concrete:
Q-learning learned the optimal path along the cliff edge but suffered more
during training because of -greedy exploration.
SARSA learned the safer path along the top of the grid and accumulated less
negative reward during training.
V
Q
ε
ε

In the next chapter, we will go beyond tabular methods. The Q-tables and V-
tables we have used only work when state and action spaces are small enough
to enumerate. For large or continuous state spaces, we need function
approximation. That is the bridge from the tabular nature of this chapter to the
deep RL methods that we'll learn.
The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
Or
If you wish to connect privately, feel free to initiate a chat here:

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Published on May 17, 2026
Previous
Next
Comments
Share
Bellman Equations and Dynamic Programming
Function Approximation

---

## Part 5: Function Approximation

*Source: `5-Function Approximation.pdf`*

RL Part 5: From tables to parameterized value functions.
Recap
In the previous chapter, we entered the model-free setting, where the agent
learns purely from interaction.
We began by clarifying what "model-free" means. The environment still has
dynamics, of course. The point is that the algorithm does not get to see 
 or 
directly. It only gets to interact, observe rewards, and adapt.

P
R
Sign Out
Account

We then covered Monte Carlo methods that estimate values by averaging full
episode returns. They are unbiased but high variance, and they only work on
episodic tasks because the return has to be computable.
Temporal-difference learning sits between MC and DP: it inherits the model-free
property from MC and the bootstrapping idea from DP. The TD(0) update uses

one observed reward plus the current estimate of the next state's value, which
lets the agent learn online, after every single step.
From TD prediction, we moved to TD control:
SARSA is the on-policy variant, using the value of the next action that the
policy actually picks.

Q-learning is off-policy, using the max over next actions, so it can learn the
optimal greedy policy while the agent itself explores.
We closed with a hands-on experiment on the Cliff Walking gridworld:
Q-learning found the optimal cliff-edge path but suffered more during
training because -greedy exploration kept knocking it off the cliff.
ε

SARSA learned the safer path along the top and accumulated less negative
reward, because its update reflects the policy that is actually being followed.
If you have not read Chapter 4, we recommend doing so first:
Model-Free Learning
RL Part 4: Learning value functions and policies without a model. Monte Carlo
methods, TD(0), SARSA, Q-learning, and the bias-variance bridge between...

Introduction
Everything we did so far fits into tables, like the Q-table in chapter 4 for Cliff
Walking had 48 cells.
Daily Dose of Data Science • Avi Chawla

Now consider something like Backgammon, where the number of distinct
positions is on the order of 
, or mountain car, the classic control benchmark
we will meet later in this chapter, where the state is a pair of real numbers
(position and velocity) drawn from a continuous range. The table approach has
nowhere to go.
This chapter is about knowing that bridge:
We will replace the table with a parameterized function.
We will set up a learning objective.
Derive the gradient Monte Carlo and semi-gradient TD updates.
Extend the control algorithms to the approximation setting.
We will then learn about the deadly triad, the combination of function
approximation, bootstrapping, and off-policy learning that can cause value
estimates to diverge.
Finally, we will train a semi-gradient SARSA agent on mountain car using tile
coding, the workhorse linear-features technique for continuous state spaces,
and plot the learned cost-to-go surface.
1020

👉
This chapter is conceptually dense and assumes strong familiarity with the
previous chapters, as well as a solid understanding of probability and
linear algebra. It is recommended to follow the explanations with pen and
paper at hand.
Let's begin!
Why tables fail at scale?
The tabular approach has two failure modes, and they compound:
Memory: When the state space is small and discrete, this is fine. When it is
large, you cannot store the table. When it is continuous, you cannot even
index into it.
Zero generalization: Updating the entry for state  changes nothing about
state 
, even if 
 is right next to . Every state-action pair has to be visited
many times for its value to settle. In a space with millions of states, you will
never visit enough of them to learn anything useful, even if memory were
s
s′
s′
s

free. What we need is a representation where updating the value at  also
updates nearby states automatically, where similar states share
information. This is what function approximation gives us.
A concrete way to feel the problem is to take a car (known as the mountain car
example), where the state is just two floats, say position 
 and
velocity 
. There are infinitely many states. A table is structurally
incapable for this. Thus we need function approximation.
One way to do this is state aggregation. Group the state space into clusters and
store one value per cluster. It is the simplest possible form of generalizing
approximation. For example, a 1000-state random walk can be grouped into 10
clusters of 100 states each.
s
∈[−1.2, 0.6]
∈[−0.07, 0.07]

The resulting value function is a staircase, which holds a piecewise constant
value within each cluster, jumping between clusters. It is crude, but it captures
the broad shape of the true value function using only 10 parameters instead of
1000.

In summary, tables are out, not because they are wrong, but because they
cannot scale and cannot generalize. The fix is to represent the value function as
a function over states, parameterized by a small set of weights.
Parameterized value functions
The shift is from a table to a function. We write:
where 
 is a parameter vector of dimension , typically much smaller
than 
.
θ ∈Rd
d
|S|

The function  can be anything that is differentiable in , for example, a linear
combination of features.
The same idea applies to action values:
^v
θ

The change is more profound than it looks. With a table, updating 
 for one
state affected only that state. With a parameterized function, changing  to fit
the value of state  also changes the predicted values at every other state,
because  depends on all the components of .
This is the generalization we need. However, it is also the source of all the new
difficulties in this chapter. We can no longer make every state's estimate exactly
right. The parameters are shared, so making one state more accurate can make
another less accurate. Thus, we are obligated to choose what we care about.
👉
The number of parameters  is typically far smaller than 
. This is not a
limitation, it is the design. Sharing parameters is what produces
generalization.
The mean square value error
The tabular case did not need an explicit objective. Updates were decoupled,
and each estimate could march independently toward its true value. With
V (s)
θ
s
^v
θ
d
|S|

function approximation, we lose that luxury, so we have to specify what "good"
means.
The standard prediction objective is the mean square value error, or MSVE. It is
a weighted average of squared prediction errors across states:
Let's unpack this:
 is the true value of state  under policy 
 is our parameterized estimate at that state
The squared bracket measures pointwise error at .
The factor 
 is a non-negative weighting that distributes our care across
the state space.
vπ(s)
s
π
^v(s, θ)
s
d(s)

The sum runs over every state.
The structure tells us two things:
Error at each state is squared, so positive and negative errors do not cancel,
meaning every deviation costs us.
 controls which states matter. A state with 
 contributes nothing
to the objective no matter how badly we mispredict it, and a state with high
 dominates.
The intuition is that with limited capacity, we cannot get everything right, so we
have to triage. The natural choice for 
 is the on-policy distribution (the long-
run fraction of time the agent spends in each state when following ). The states
the policy visits often get prioritized. The states the policy never visits, we
cannot learn about them anyway, so weighing them is irrelevant.
A useful sanity check is that if 
 were a uniform distribution and  were
perfect everywhere, MSVE would be zero. Any deviation lifts it above zero,
weighted by where we care.
d(s)
d(s) = 0
d(s)
d(s)
π
d(s)
^v

👉
MSVE is the standard objective for prediction. It is not provably the right
objective for control: the value function that minimizes MSVE may not be
the value function that yields the best policy when used greedily.
One important thing to note is that we usually do not know the true value
function 
. Because of that, we cannot compute MSVE directly.
Instead, MSVE serves as a theoretical objective that tells us what good
predictions look like. The learning algorithms we build update the parameters
in ways that, in expectation, descend MSVE, and we will track how closely they
actually do so.
Linear function approximation
The most important special case is when  is linear in . This is the case where
everything generalizes cleanly from the tabular setting and where almost every
theoretical result lives.
vπ(s)
^v
θ

Each state is represented by a feature vector:
The value estimate is then the inner product of features and weights:
The terms:
 is the -th feature evaluated at state , a fixed function of the state.
 is the learnable weight for that feature.
The product 
 is the contribution of feature  to the predicted value at
, and we add up all such contributions.
ϕi(s)
i
s
θi
θiϕi(s)
i
s

The intuition has two parts:
First, the features carry the inductive bias: similarity in feature space
implies similarity in predicted value. Two states with nearly identical
feature vectors must have nearly identical predicted values, by
construction.
Second, the weights carry the learning: as  changes, every state's predicted
value changes in a coordinated way determined by the features.
The gradient is the cleanest part. Differentiating 
 with respect
to  gives 
. That is, the gradient at state  is just the feature vector at . This
is what makes linear methods so tractable.
👉
The tabular case is a special instance of linear FA. If you choose features to
be one-hot indicators (one feature per state, equal to 1 at that state and 0
elsewhere), then  is the table, 
 selects one entry, and the linear
method reduces exactly to the tabular update.
In summary, linear FA gives us a representation with two pieces: a fixed feature
map  that carries the inductive bias, and a learnable weight vector  that
θ
^v(s, θ) = θ⊤ϕ(s)
θ
ϕ(s)
s
s
θ
ϕ(s)
ϕ
θ

carries the learning. The gradient is the feature vector itself, which makes
everything that follows simple to derive and to implement.
Gradient Monte Carlo
Let's now understand our first learning algorithm for the function
approximation setting. The idea is to treat each visit to a state as a supervised
training example.
The supervised setup is this:
→ input 
, target 
 (the return observed from 
 onward), and we want to
make 
 close to 
. The standard tool is stochastic gradient descent on the
squared error.
After observing 
, we adjust  in the direction that most reduces
. That is:
St
Gt
St
^v(St, θ)
Gt
(St, Gt)
θ
[Gt −^v(St, θ)]
2

The terms:
 is the actual observed return from time , computed by playing the
episode out to termination.
 is the current estimate.
The bracketed difference is the prediction error.
The gradient 
 is the direction in parameter space that increases
 fastest.
 is the step size.
For linear function approximation, the squared error is convex in , so the local
minimum is the global minimum. Gradient Monte Carlo with linear FA provably
converges to the parameter vector that minimizes MSVE, under the on-policy
distribution.
Gt
t
^v(St, θ)
∇θ^v(St, θ)
^v(St, θ)
α
θ

Now, coming to limitations, they are also the same as in the tabular case:
Gradient MC is episodic-only, since 
 has to be computable.
It has to wait for the episode to end before any update happens.
It inherits MC's high variance: the return is a sum of many rewards, so two
samples from the same state can differ enormously.
👉
Gradient MC is the only algorithm in this chapter that is a true gradient
method on a well-defined squared-error objective. Every other algorithm
we look at relaxes this in some way and pays a theoretical price for it.
These three problems are exactly what motivated TD in the tabular setting. Let's
apply the same fix here.
Semi-gradient TD(0)
Gt

Suppose we want to replace the MC target 
 with a TD-style one-step target.
The natural choice is:
This uses one observed reward, then bootstraps off the current value estimate of
the next state. The update becomes:
The target, 
, depends on . If we took a true gradient of the
squared TD error, we would have to differentiate through both 
 (the
prediction) and 
 (the bootstrapped target).
Gt
Rt+1 + γ^v(St+1, θ)
θ
^v(St, θ)
^v(St+1, θ)

But we do not; we deliberately freeze the target and only differentiate the
prediction. That is what "semi" in semi-gradient means: only part of the gradient
is taken. The bootstrap term is treated as if it were a fixed target, when in reality
it moves whenever  moves.
This sounds counterintuitive, and in a sense it is. The theoretical convergence
guarantees we had for gradient MC do not carry over. The update is not a true
θ

gradient of any objective, so we cannot lean on stochastic gradient descent
convergence theorems.
So why do we use it? There are two reasons for this:
Bootstrapped targets have far lower variance than full Monte Carlo returns.
Semi-gradient methods can update online, after every single step, on
continuing tasks.
The same advantages we had with tabular TD over tabular MC carry over here
too.
And in important settings, semi-gradient TD does converge. In particular, linear
semi-gradient TD(0) with on-policy sampling is guaranteed to converge to a
unique stable solution called the TD fixed point.

We will not derive this full formula here; the intuition matters more. The TD
fixed point is simply the parameter vector where the expected TD update
becomes zero. In other words, once learning reaches this point, the updates stop
changing the parameters on average.
However, this solution is generally not the one that minimizes MSVE. The
solution found by gradient Monte Carlo usually achieves a lower prediction
error because it directly optimizes MSVE, whereas TD learning relies on
bootstrapping.
Still, the important result is that TD's solution is provably well-behaved.
Tsitsiklis and Van Roy (1997) showed that the error at the TD fixed point cannot
be arbitrarily worse than the error of the best possible linear approximation. So

even though TD may not find the optimal approximation, it still converges to a
stable and useful one.
👉
Two important caveats sit behind this result. First, it assumes linear FA.
With nonlinear FA, even on-policy semi-gradient TD can diverge. Second, it
assumes on-policy sampling. With off-policy sampling, divergence is
possible even with linear FA. We will see this happen in the Baird's
counterexample experiment.
In summary, semi-gradient TD trades a clean convergence guarantee for online,
low-variance updates that work on continuing tasks. In the on-policy linear case,
the trade is favorable: we lose the MSVE optimum but gain everything else.
Semi-gradient SARSA and Q-learning for control
The shift from prediction to control follows exactly the pattern we used in
Chapter 4: replace state values with action values, and act -greedily with
respect to them.
ε

We now have a parameterized action-value function 
, with features
 that depend on both state and action. There are several ways to
construct such features. One common choice is to compute state features 
and "stack" them across actions, so each action gets its own copy of the state-
feature weights. We will use this idea in the Mountain Car hands-on through tile
coding's integer-tagging mechanism.
The semi-gradient SARSA update is:
This mirrors tabular SARSA exactly. The TD target uses 
, the action that the
current policy actually picks at 
. The update is on-policy: the policy that
generates behavior is the same policy whose value we are estimating.
The semi-gradient Q-learning update changes one thing:
^q (s, a, θ)
ϕ(s, a)
ϕ(s)
At+1
St+1

The max over  replaces the sampled 
, making the update off-policy. The
target is the value of the greedy action at the next state, regardless of what
action the behavior policy actually takes.
Now let's talk about convergence. For semi-gradient SARSA with linear FA and a
fixed -greedy policy, the situation is similar to TD prediction. The algorithm
tends to chatter, oscillating in a bounded region rather than converging to a
single parameter vector, because the policy keeps changing as  updates. In
practice, it works well on tasks like Mountain Car.
For semi-gradient Q-learning with linear FA, the off-policy nature plus the max
operator plus the bootstrapping is the dangerous combination we are about to
see fail. There is no general convergence guarantee. Sometimes it works;
sometimes the weights diverge.
In summary, control with function approximation reuses the SARSA and Q-
learning ideas from Chapter 4, but the convergence picture gets harder. Semi-
a
At+1
ε
^q

gradient SARSA is reasonably well-behaved on-policy. Semi-gradient Q-learning
is off-policy and lives one step closer to the deadly triad.
The deadly triad
Three properties are individually desirable in a reinforcement learning
algorithm:
Function approximation, because tables do not scale.
Bootstrapping, because waiting for full returns is slow and high-variance.
Off-policy learning, because we want to learn about an optimal policy while
exploring with a different one (this is what makes Q-learning attractive).
The trouble was identified by Baird (1995) and Tsitsiklis and Van Roy (1997), and
was named the "deadly triad" by Sutton and Barto. When all three properties
are used together, value estimates can diverge. The parameters do not just fail to
converge; they can grow without bound.
Why is the triad dangerous?

The short answer is that each ingredient introduces a kind of amplification, and
the three amplifications compound.
Function approximation generalizes: changing  to fit one state changes the
predicted values of many other states.
Bootstrapping means the update target depends on those predicted values.
Off-policy learning means the distribution over which we sample updates
does not match the distribution that the bootstrapped targets are implicitly
assuming.
The combination can set up a feedback loop. A prediction error at one state
propagates through the function approximator to states it shouldn't. It then gets
fed back into the bootstrapped target, and grows on each update.
However, it is worth being precise about what is and is not at risk. Any two of
the three ingredients without the third is provably fine. For example:
Tabular methods with bootstrapping and off-policy (no FA): tabular Q-
learning converges.
Function approximation with bootstrapping and on-policy: linear semi-
gradient TD on-policy converges.
θ

The triad is specifically about combining all three.
👉
The phrase "deadly triad" can sound alarming. The reality is that all three
ingredients are useful in isolation. Each pair is also fine. It is only the
specific three-way combination that creates the divergence risk, and that
risk is realized only on certain problems. The deadly triad describes a
possibility of divergence, not an inevitability.
The deadly triad is the central practical concern in modern value-based deep RL.
DQN is essentially Q-learning with neural network function approximation,
which sits squarely in the danger zone. The fact that DQN works at all is due to
two specific engineering choices, target networks and experience replay, both of
which exist primarily to tame the triad. We will see this in detail in a future
chapter.
For now, we have understood all the key concepts for this chapter. The pieces
are in place. So let's go ahead and dive into hands-on section for some practical
experimentation.

Hands-on demonstrations
Baird's counterexample
Baird's counterexample is the standard textbook demonstration that the deadly
triad can produce divergence. It is a tiny linear system with no neural networks,
no exploration noise, and not much going on at all. The divergence it produces is
monotonic and unambiguous, which strips the phenomenon down to its bones.
The code and project setup are attached below as a zip file. You can extract it
and run uv sync  to get going.
Download the zip file below:
baird-counterexample
baird-counterexample.zip • 36 KB

For details about versions and dependencies, check the .python-version  and
pyproject.toml  files.
The environment
The MDP has seven states. Six are "upper" states, one is a "lower" state. There
are two actions, traditionally called dashed  and solid . The dashed action sends
the agent to one of the six upper states uniformly at random. The solid action
sends the agent deterministically to the lower state.

All rewards are zero. The discount factor is 
.
The behavior policy  picks the dashed action with probability 
 and the solid
action with probability 
. The target policy  picks the solid action with
probability , deterministically.
Because all rewards are zero and the episode is non-terminating in any
meaningful sense, the true value function under any policy is 
 for
every state .
The features are designed by Baird specifically to expose the instability. There
are seven states and eight weights 
. The feature vector for upper
state  (for 
) puts a  in the -th slot and a  in slot . The lower state
puts a  in slot  and a  in slot . So state  has value 
 for
the upper states, and 
 for the lower state.
The true value function 
 is representable: just set 
 and every  is
zero. The features have enough capacity, so this is not a representational failure.
The failure will be entirely in the learning dynamics.
Implementation
Let's now dive into the code:
γ = 0.99
b

π
1
vπ(s) = 0
s
w1, ... , w8
i
i = 1, ... , 6
2
i
1
8
1
7
2
8
i
^v(si, θ) = 2wi + w8
^v(s7, θ) = w7 + 2w8
vπ = 0
θ = 0
^v



Here:
build_feature_matrix()  constructs the feature matrix 
, where each
row corresponds to the feature vector 
 for one of the seven states. This
matrix defines the linear function approximator used in Baird's
counterexample and encodes the intentionally pathological feature
structure that causes divergence.
run_expected_semi_gradient_dp()  implements the deterministic expected-update
version of semi-gradient TD. Instead of sampling transitions from
interaction with the environment, the algorithm directly applies the
expected TD update across all states at every sweep. Under the target policy,
every state transitions to state 7 (state 6, by index), so the update uses
 as the bootstrap target for every state.
For each state, the TD error is 
, since all rewards are
zero. The semi-gradient update multiplies this TD error by the feature
Φ ∈R7×8
ϕ(s)
^v(s7, θ)
0 + γ^v(s7, θ) −^v(s, θ)

vector 
 and accumulates the result across states before updating the
weights.
👉
Because this version uses the exact expected update operator, there is no
sampling noise. The key point is that the weights still diverge. This shows
that the instability is inherent to the update rule itself, not caused by
randomness in the samples.
Moving ahead:
ϕ(s)





The code also includes run_semi_gradient_off_policy_td() , which implements the
sampled off-policy TD version. Here, transitions are generated using the
behavior policy, and updates are corrected using the importance sampling ratio:
The behavior policy chooses the dashed action with probability 
 and the
solid action with probability 
, while the target policy always chooses the
solid action.
As a result:
for the dashed action, 
 because the target policy would never take that
action, so those updates contribute nothing,
for the solid action, 
.

ρ = 0
ρ = 7

👉
The importance sampling ratio  corrects for the mismatch between the
behavior policy and the target policy. In the TD update,  simply scales the
update size. If the behavior policy takes the dashed action, then 
because the target policy would never take that action, so the update is
ignored. If the behavior policy takes the solid action, then 
 because
the target policy always takes that action while the behavior policy takes it
only with probability 
. As a result, those updates are amplified to
compensate for the fact that they are sampled rarely under the behavior
policy.
This sampled version more closely resembles how a real RL agent would learn
from experience, but its updates are noisy because they depend on randomly
sampled states and actions.
Results
Running the code produces:
ρ
ρ
ρ = 0
ρ = 7

And the two graphs look like:



The diagnosis is very clean. The true value function is zero everywhere, and the
function approximator is fully capable of representing it; setting 
 gives the
correct solution exactly. The features themselves are not the problem, and since
every reward is zero, there is no misleading reward signal either. In principle,
the learning problem should be trivial. Yet the weights still grow without bound.
θ = 0

The reason is that the off-policy semi-gradient TD update becomes unstable. The
estimate at the lower state 
 gets bootstrapped into the upper states through
the shared feature weight 
. Because many states share this component, an
increase in the estimate at one place feeds back into updates elsewhere. Instead
of correcting the estimates, the updates reinforce each other.
The off-policy weighting makes this even worse. The importance sampling
correction amplifies the updates associated with the target-policy action, so the
bootstrap signal keeps getting pushed back into the system with increasing
strength. Rather than damping errors over time, the update rule creates a
positive feedback loop, causing the weights to grow geometrically even though
the correct value function is simply zero everywhere.
👉
The takeaway is not that TD is broken. The takeaway is that the
combination of FA, bootstrapping, and off-policy distribution can break it.
Now let's go ahead and take a look at our second hands-on demo.
Mountain car with semi-gradient SARSA
s7
w8

A control problem with a continuous state space, where function approximation
actually solves something useful.
The code and project setup are attached below as a zip file. You can extract it
and run uv sync  to get going.
Download the zip file below:
mountain-car
mountain-car.zip
For details about versions and dependencies, check the .python-version  and
pyproject.toml  files.
• 40 KB

The environment
Mountain car is a classic underactuated control task. An underpowered car sits
in a valley between two hills. The goal is to drive the car up the right hill, but the
engine is not strong enough to climb directly. The car must build momentum by
swinging back and forth.
The state is two-dimensional:
position 
velocity 
The action space has three discrete actions: accelerate left, no acceleration,
accelerate right. The reward is 
 at every step until the agent reaches the goal
(position 
), at which point the episode terminates.
∈[−1.2, 0.6]
∈[−0.07, 0.07]
−1
≥0.5

We use the standard Gymnasium implementation, MountainCar-v0 , with
max_episode_steps  set to 10,000.
Tile coding
The features we use are based on tile coding, one of the standard linear function
approximation methods for continuous, low-dimensional state spaces.

The core idea is simple: divide the state space into a grid of regions called tiles.
For any given state, we activate the feature corresponding to the tile containing
that state and set all other features to zero. In this sense, a single tiling behaves
much like state aggregation or one-hot encoding.
The real power comes from using multiple overlapping tilings instead of just
one. Each tiling is shifted slightly relative to the others by a fraction of a tile
width. As a result, a state activates one tile in every tiling, so multiple features
become active simultaneously.
Nearby states end up sharing many of the same active tiles, which naturally
introduces generalization: similar states produce similar feature
representations.
👉
The overlapping offsets also provide much finer resolution than a single
coarse grid could achieve on its own. A single tiling would create abrupt
boundaries, but multiple shifted tilings smooth those boundaries while
still preserving locality.
We use Richard Sutton's canonical tile coding implementation, tiles3.py , which
performs grid-style tile coding with index hashing.

In our setup, we use 8 tilings, with each tiling containing 8 tiles per dimension.
👉
Recommended rule of thumb: the number of tilings should be a power of 2
and at least four times the number of float dimensions. We have two float
dimensions (position, velocity), so 8 tilings is the minimum acceptable. The
number of tiles per dimension controls how fine the partition is within
each tiling.
Implementation
Let's now dive into the code:
RLAI open web page



Here:
The TileCoder  class scales position and velocity to the unit range expected by
tiles()  and queries the IHT (index hash table) for the active tile indices for

a given (state, action) pair.
The SemiGradientSarsa  agent holds a weight vector  of length 4096. The
action-value 
 is the sum of weights at the active tile indices, since
the active features are all  and inactive ones are . Computing  is
therefore an indexed sum, not a full dot product.
👉
In mountain car, we use tile coding to turn the 2 continuous variables
(position, velocity) into features. With a typical setup of 8 tilings of 8×8
tiles across 3 actions, you theoretically get up to 1536 distinct active
features. Tile coding stores these in a hash table, and the table size should
be a power of 2 (for fast hashing) and bigger than the number of tiles
you'll ever need (to avoid two different states accidentally sharing the
same weight). 4096 is just the next power of 2 that comfortably fits, enough
room to avoid collisions, small enough to stay cheap.
Action selection is -greedy with random tie-breaking. The update applies
the semi-gradient SARSA rule, that is, compute the TD error against the next
(state, action) pair, then update the weights at the currently-active tiles (the
division by num_tilings  is the standard step-size scaling for tile coding, since
each update touches num_tilings  active features at once).
θ
^q (s, a, θ)
1
0
^q
ε

Moving ahead to the training loop:





The training script runs semi-gradient SARSA on Mountain Car for 500 episodes.
At the start of each episode, the environment resets the car to a random position
near the bottom of the valley with zero velocity. The agent then chooses an
action, observes the next state and reward, and immediately updates its action-
value estimate. This means learning happens online, one transition at a time,
rather than after the full episode is over.
During training, we also save snapshots of the learned cost-to-go function at
episodes 1, 12, 104, and 500. The cost-to-go is plotted as:
This gives an estimate of how many negative-reward steps remain before
reaching the goal from each state. These snapshots let us see how the agent's
value function changes as learning progresses. The selected episode numbers
are inspired by Sutton and Barto's mountain car example, where they visualize
the cost-to-go surface at different stages of learning.

One important detail is that the weights are initialized to zero. In mountain car,
every step gives a reward of -1, so successful value estimates become negative.
Because of that, an initial value of zero is optimistic: an untried action looks
better than actions the agent has already tried and found costly.
This optimism creates natural exploration. Even though the agent uses 
,
meaning it always acts greedily, it still explores because unknown actions
initially look more attractive than known bad ones. As the agent tries actions
and updates their values downward, it gradually discovers better ways to build
momentum and reach the goal.
Running the experiment
We use these hyperparameters: 
 (scaled internally to 
per tile), 
, 
, 8 tilings, 8 tiles per dimension, IHT size 4096, 500
episodes.
Running train.py  produces:
ε = 0
α = 0.1
0.1/8 = 0.0125
ε = 0 γ = 1.0

The first episode takes 1,890 steps because the agent is wandering with zero-
initialized values. By episode 12 the agent has discovered the back-and-forth
strategy and is reaching the goal in roughly 660 steps.
By episode 104, it has converged to a reasonable policy taking around 209 steps.
By episode 500, it is at 117 steps per episode. And a best run of 86 steps.
The graph also conveys a similar story:

Now, coming to the cost-to-go surface:

The cost-to-go surface tells the learning story much more clearly.
At the beginning, the surface is noisy and poorly shaped because the agent has
not yet learned which states are useful and which are dangerous. As training
progresses, the structure becomes smoother and more meaningful.
The highest region of the surface corresponds to states with the largest expected
remaining cost to reach the goal. In mountain car, this happens deep in the
valley with near-zero velocity. From there, the car has very little momentum
and still needs many future steps before it can climb the hill and reach the
target.
The lowest region appears near the goal state, where only a few steps remain.

👉
Lower cost-to-go means the agent expects to finish sooner.
Over time, the learned surface develops a smooth gradient across the state
space. That gradient reflects how the agent evaluates progress: states with more
useful momentum and position receive lower expected cost, while states that
are hard to recover from receive higher cost.
Under the greedy policy, the agent chooses actions that move it downhill on this
surface toward states with lower expected future cost.
That wraps up the hands-on section. With this, we conclude the discussion for
this chapter. In the upcoming chapters, we will continue to build on the core
ideas of RL and explore concepts and their implementations wherever
applicable.
Conclusion

In this chapter, we made the transition from tables to parameterized value
functions. The reasons were structural: tables do not scale and do not
generalize. The fix is to represent the value function as a function over states,
with a small parameter vector  controlling its shape.
We laid out the prediction objective, mean square value error, with the on-policy
distribution as the natural weighting. We also worked through linear function
approximation in detail.
From there, we built two update algorithms:
Gradient Monte Carlo uses the full return as a target, and because the target
is independent of , the update is a true gradient method with standard
convergence guarantees.
Semi-gradient TD(0) replaces the return with a bootstrapped target, gaining
online updates and low variance, but introducing the bias of "differentiating
only the prediction, not the target."
We then extended both ideas to control. Semi-gradient SARSA learns  on-policy
and works reliably with linear FA. Semi-gradient Q-learning uses the max over
actions, making it off-policy and putting it inside the deadly triad.
θ
θ
^q

We also saw this divergence in code. Baird's counterexample produced
monotonic, unbounded weight growth despite a true value function of zero and
features capable of representing it exactly.
Then Mountain Car showed the other side of the picture: semi-gradient SARSA
with tile coding, solving a continuous-state control problem cleanly, with the
cost-to-go surface reconstructing the underlying physics.
Building upon this foundation, in the next chapter, we will be exploring and
learning about deep reinforcement learning.
The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
Or

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
If you wish to connect privately, feel free to initiate a chat here:
Published on May 24, 2026
Previous
Next
Comments
Share
Model-Free Learning
Introduction to Deep RL and DQN

---

## Part 6: Introduction to Deep RL and DQN

*Source: `6-Introduction to Deep RL and DQN.pdf`*

RL Part 6: From linear features to neural networks, and the engineering choices that makes deep
value-based RL possible.
Recap
In the previous chapter, we made the transition from tables to parameterized
value functions.

Sign Out
Account

The reasons were structural. Tables do not scale, and they do not generalize.
Mountain car has a state space made of two real numbers, so it is impossible to
even index into a table for it. And updating one cell of a Q-table tells us nothing
about the cell next to it. The fix was to write the value function as a function
over states, with a small parameter vector  controlling its shape.
θ

We laid out the prediction objective, mean square value error. We then worked
through linear function approximation in detail, where the value estimate is the
inner product of fixed features and learnable weights.
From that foundation, we built two learning algorithms:
Gradient Monte Carlo uses the full return as a target, which makes it a true
gradient method on a well-defined squared-error objective.

Semi-gradient TD(0) replaces the return with a bootstrapped target, gaining
online updates and low variance, but introducing the bias of differentiating
only the prediction and not the target.
We then extended our understanding to control:
Semi-gradient SARSA learns the action-value function on-policy and works
reliably with linear features.

Semi-gradient Q-learning uses the max over next actions, making it off-
policy. This places it squarely inside what Sutton and Barto call the deadly
triad: function approximation, bootstrapping, and off-policy learning
combined.
Finally in the hands-on section, we saw the deadly triad cause divergence on
Baird's counterexample, a tiny seven-state MDP where the weights grow without
bound even though the true value function is zero everywhere.



We also saw the other side of the picture with semi-gradient SARSA on Mountain
Car. Tile coding gave us a useful continuous-state representation, and the cost-to-
go surface reconstructed the underlying physics of the task.



If you have not read Chapter 5, we recommend doing so first:
Introduction
The deadly triad demonstration at the end of Chapter 5 made one thing clear.
Combining function approximation, bootstrapping, and off-policy learning
creates a real risk of divergence, and that combination is exactly what we want
for scalable value-based RL:
We want function approximation because tables do not scale.
We want bootstrapping because waiting for full returns is slow.
We want off-policy learning because we want to learn about an optimal
greedy policy while exploring with a softer one.
Function Approximation
RL Part 5: From tables to parameterized value functions.
Daily Dose of Data Science • Avi Chawla

This chapter is about how the field made that combination work in practice.
We will extend the function class from linear to neural, watch new instabilities
emerge in the deep setting, and see how DQN's two engineering choices,
experience replay and target networks, tame them. The chapter then closes with
a hands-on experiment training a DQN agent on CartPole.

👉
CartPole is a classic control theory and reinforcement learning
benchmark. The objective is to balance a pole vertically on a moving cart
by applying left or right forces.
Let's begin!
From linear to neural
The mechanical step from linear function approximation to neural function
approximation is small. We already know the action-value function as a linear
combination of features:

The shift is to replace this expression with a more general parameterized
function:
where, 
 is now any function differentiable in , typically a neural network.
The structure tells us the key change. With linear FA, the features carried the
inductive bias and the weights did the learning. With neural FA, the network
does both. Nothing about the underlying RL problem changes.
The MDP is the same, the Bellman equations are the same, only the function
class used to approximate the value function has grown.
fθ
θ

The reason we want this change is representation learning. Hand-designed
features work well when the state space is low-dimensional and we know what
matters. But for higher dimensions, we almost always have no idea what the
right features are. A neural network discovers them from data.
👉
The gradient computation also changes. With linear FA, the gradient of 
with respect to  was just 
. With neural FA, the gradient is
^q
θ
ϕ(s, a)

computed by backpropagation through the network.
The trade-off is theoretical. In Chapter 5, we noted that linear on-policy semi-
gradient TD converges to a unique fixed point. That result depends on linearity.
With nonlinear function approximation, even on-policy semi-gradient TD can
diverge.
So moving to neural networks gives up the theoretical guarantees we had with
linear FA, even before we add off-policy learning back into the mix.
The field accepts this trade-off because the empirical results justify it, and
because engineering choices make the situation tractable in practice.
In summary, the move to neural function approximation is a small mechanical
change that buys us representation learning, at the cost of the convergence
guarantees we had with linear features.
The rest of the chapter is about what goes wrong when we make this move, and
what we do about it.

The naive approach and what breaks
Let's try the most direct approach. Take semi-gradient Q-learning from Chapter
5, swap the linear function for a neural network, and run it online.
The update rule is:
The terms:
The bracketed expression is the TD error.
 is the gradient of the predicted Q-value with respect to all
network parameters, computed by backpropagation.
 is the step size.
In structure, this is identical to what we had with linear FA. The only difference
is what  and its gradient look like under the hood.
∇θ^q (St, At, θ)
α
^q

Run this loop on a problem like CartPole, and the agent learns nothing. Often,
the weights drift, the loss climbs, and the agent's behavior gets worse over time.
There are three reasons, and each one maps back to something we already
discussed in Chapter 5:
The first problem is sample correlation. In online learning, the data we train
on comes from consecutive transitions in the environment. Two consecutive
states in CartPole differ by one small physics step. Thus two consecutive
samples are not independent, they are tightly correlated. Stochastic gradient
descent assumes (or at least works much better with) approximately
independent and identically distributed samples. When samples come in a
correlated sequence, the network overfits to whatever local region of the
state space the agent happens to be in, and forgets about regions it visited
earlier.

The second problem is non-stationary targets. The TD target
 depends on . Every time we take a gradient
step, the target shifts too. We are trying to fit a moving target, and the
moving target depends on us. In Chapter 5 we spelled this out as the core of
the semi-gradient idea: we differentiate only the prediction, not the target.
With linear FA and on-policy sampling, this was tolerable. But with neural
FA and off-policy sampling, the same trick stops being tolerable. A small
change in  propagates through the network and can change the predicted
Rt+1 + γ maxa′ ^q (St+1, a′, θ)
θ
θ

value at many states at once, including the next state we are about to
bootstrap from. The target now moves in unpredictable directions every
update.
The third problem is the deadly triad in full nonlinear form. We are using
function approximation (the network), bootstrapping (the TD target), and
off-policy learning (the max over next actions). This is exactly the
combination Baird's counterexample showed was unstable, and now we are
scaling it up to a much larger function class.

This was the situation in 2013, when Mnih et al. published "Playing Atari with
Deep Reinforcement Learning". It was the first deep learning model to
successfully learn control policies directly from high-dimensional sensory input
using reinforcement learning.
The contribution was not the basic idea of combining Q-learning with a neural
network. That had been tried before. The contribution was the engineering
choices that made it work: experience replay and, in the 2015 Nature version,
target networks. We turn to those next.
Experience replay
The first of DQN's two engineering choices is experience replay.
The idea is simple. Instead of learning from each transition immediately and
then discarding it, the agent stores transitions in a buffer and trains on
minibatches sampled randomly from the buffer.

Concretely, the agent maintains a fixed-size buffer 
 (a FIFO queue), and at
every step it does two things:
It adds the latest transition to the buffer.
It samples a minibatch of transitions uniformly at random from the buffer
and applies the Q-learning update on that minibatch.
D

This directly addresses the first problem from the previous section. Transitions
in a minibatch sampled randomly from the buffer are no longer consecutive in
time.
They come from many different points in the agent's past, possibly from
different episodes, possibly from different regions of the state space. The
samples in a single gradient update are approximately decorrelated, which is
much closer to what stochastic gradient descent expects.
Experience replay also gives us sample efficiency. Without replay, each
transition is used exactly once before being discarded. With a buffer of N
transitions, each transition gets used multiple times across many gradient
updates. The same data drives more learning.
👉
There is something subtle going on here. Experience replay only works
because Q-learning is off-policy. When we sample a transition from the
buffer, we are sampling from the distribution of states and actions that
some past version of the policy produced. That distribution differs from
what the current policy would produce. An on-policy algorithm like SARSA
cannot tolerate this mismatch cleanly, because its update implicitly
assumes the action 
 at the next state was drawn from the current
At+1

policy. Q-learning's max operator does not care which action the behavior
policy actually took.
The trade-off, however, is that experience replay pushes Q-learning further into
the deadly triad.
The samples in the buffer were generated by a behavior policy that differs from
the current target policy, and that mismatch grows the longer a transition sits in
the buffer.
So while replay solves the correlation problem cleanly, it does not solve the
deadly triad on its own. For that, we need the second engineering choice.
Target networks
The idea here is to maintain two copies of the Q-network:
The online network 
 has its parameters updated at every step.
Qθ

The target network 
 has its parameters held fixed, and only periodically
copied from .
In the TD target, we use the target network instead of the online network:
where, 
 is the target network's parameters, updated less frequently.
The loss minimized at each gradient step is then:
Qθ−
θ
θ−

The expectation is taken over transitions sampled from the replay buffer 
. The
gradient is taken with respect to  only, because 
 is treated as a constant. This
is the same semi-gradient idea from Chapter 5. The target does not depend on
the current . It depends on 
.
This directly addresses the second problem from earlier. The target is no longer
a moving function of the parameters we are updating. Between target updates, it
is a fixed function.
We are doing supervised regression toward a fixed target for 
 steps, then
refreshing the target, then doing supervised regression toward a slightly
different fixed target for the next 
 steps. The training signal looks much more
like ordinary deep learning, which is something the optimizer can handle.
There are two common ways to refresh the target network:
Hard updates copy  into 
 every 
 steps, then leave 
 frozen until the
next copy.
Soft updates do a slow exponential average at every step:
 for some small  (like 0.005).
D
θ
θ−
θ
θ−
C
C
θ
θ−
C
θ−
θ−←τθ + (1 −τ)θ−
τ

👉
Hard updates are simpler and were used in the original DQN paper. Soft
updates are smoother and avoid the discontinuous jumps in the target, at
the cost of introducing  as another hyperparameter.
The trade-off is that the target network slows down learning.
In summary, the target network combined with experience replay gives us the
two pieces we need to make deep Q-learning possible.
The DQN algorithm
Now let us put the pieces together. Deep Q-Network, is the combination of Q-
learning, a deep neural network for the action-value function, experience
replay, and a target network. Here is the algorithm:
τ

A few details deserve unpacking:
The terminal-state handling matters. When a transition ends an episode (the
done  flag is true), there is no next state to bootstrap from. The target is just
the observed reward, with no 
 term.
👉
If we forget this, the agent ends up bootstrapping off whatever garbage the
target network predicts for impossible states, and learning silently
degrades.
γ max

The Huber loss is a robustness choice. It uses a squared term when the error
is small (below a threshold) and a linear term when the error is large. This
makes it less sensitive to outliers than mean squared error, and in some
cases prevents exploding gradients.
👉
Early in training, TD errors can be very large. Squaring them produces
enormous gradients that destabilize the network. Huber loss keeps the
gradients bounded once the error exceeds the threshold.
The exploration uses standard -greedy on the online network. Typically, 
starts near 1.0 (almost all random actions) and decays linearly to a small
value like 0.05 over the first part of training. The target network is never
used for action selection. It only computes the bootstrap target.
👉
The choice of 
 is one of the most important hyperparameters in DQN. Too
small, and the target network behaves like the online network, and we are
back to the moving-target problem. Too large, and learning slows to a
crawl because the bootstrap signal is stale. Hence, given a problem, it
could require a bit of tuning before you actually start seeing what you
want.
ϵ
ϵ
C

Limits of DQN
Despite its success, DQN has limits:
The first limit is continuous action spaces. DQN's bootstrap target uses
, which requires enumerating all actions at the next state.
With a discrete action space it is fine, but with a continuous action space,
that becomes an issue. There are infinitely many actions to consider, and no
closed-form solution to picking the best one.
Another limitation is sample inefficiency. This means vanilla DQNs often
require too many (millions of) environment interactions to learn anything.
Exploration is also a major limitation. -greedy only finds rewards that
random actions can stumble into. Solving several RL problems requires
more structured exploration. But that's a substantial topic in its own right.
In summary, DQN is not a finished story. It is a specific algorithm that works
well on a specific class of problems: discrete actions, dense rewards, and
simulators where you can afford millions of interactions.
maxa′ Qθ−(s′, a′)
ϵ

We have now understood all the key concepts for this chapter. The pieces are in
place. So let's go ahead and dive into hands-on section for some practical
experimentation.
Hands-on: DQN on CartPole
For our hands-on demonstration, we will implement DQN and train it on
CartPole.
The code and project setup are attached below as a zip file. You can extract it
and run uv sync  to get going.
Download the zip file below:

dqn
dqn.zip
For details about versions and dependencies, check the .python-version  and
pyproject.toml  files.
The environment
CartPole-v1 is a classic control benchmark from Gymnasium. A cart moves along
a one-dimensional track, with a pole attached to it by a frictionless hinge. The
goal is to keep the pole upright by pushing the cart left or right.
The state is four-dimensional:
cart position
cart velocity
pole angle
pole angular velocity
• 130 KB

The action space has two discrete actions: push left (0) and push right (1). The
reward is +1 for every step the pole stays up. The episode ends if the cart
position exceeds the bounds, the pole angle exceeds ±0.2095 radians, or the
episode reaches 500 steps.
A return of 500 means the pole stayed up for the entire episode (the maximum).
The default reward threshold for considering the task solved is 500 for v1.
Code
Let's now take a look at the key portions of our training script. Starting with
defining the Q-network:

QNetwork  defines the action-value function as a small MLP. Two hidden layers of
128 units each, with ReLU activations.
The output layer has one unit per action (here, two: push left and push right).
The forward pass returns Q-values for all actions at the given state.
Next, let's define the replay buffer:

ReplayBuffer  is a thin wrapper around collections.deque  with maxlen  set to the
capacity.
The push  method adds a new transition; old transitions fall off the other end
automatically when the buffer fills up.

The sample  method draws a random minibatch and stacks the components into
tensors for the network.
Moving ahead:



Here:
The hyperparameters here are fine for small environments:
Learning rate 5e-4
Discount factor 0.99
Replay buffer capacity 10,000 transitions.
Batch size 128
Epsilon decays linearly from 1.0 to 0.01 over the first 10,000 steps, after
which exploration stays at 1%.

LEARNING_STARTS  is the number of env steps (1000) we collect before
starting gradient updates, so the replay buffer has a sufficient pool of
transitions to sample from. Without it, we'd train on a tiny, highly
correlated batch.
TAU  is the soft update hyperparameter.
epsilon_by_step  computes the linear epsilon schedule. The agent explores
randomly almost all the time at the start, then increasingly relies on its
learned Q-values.
select_action  implements -greedy. With probability , return a random
action. Otherwise, pass the state through the online network and pick the
action with the highest predicted Q-value. The torch.no_grad()  block prevents
the network from tracking gradients during action selection, since we're not
training here.
train_step  is where the DQN update happens. After sampling a minibatch
from the buffer, it computes the current Q-values for the actions actually
taken ( gather  picks out the right column from each row). Then, under
torch.no_grad() , it computes the bootstrap target using the target network,
with the  term zeroed out for terminal transitions. The loss is Huber
( smooth_l1_loss  in PyTorch). Gradient clipping with a norm cap of 10
ϵ
ϵ
γ

prevents very large updates from destabilizing training. Finally the soft
update (Polyak averaging) of target network parameters.
Finally, let's take a look at the main  function:



main  ties it all together. It creates the environment, builds the two networks, and
runs the episode loop.
At every environment step, it selects an action, stores the transition, and takes a
training step (after LEARNING_STARTS  steps have accumulated, so the buffer has
enough data).

👉
One detail worth flagging: when storing the done  flag in the replay buffer,
we use terminated  (the pole fell or the cart left bounds), not terminated or 
truncated . In Gymnasium, truncated  means the episode hit the time limit
(500 steps), not that the state was actually terminal. If the agent
successfully balances for 500 steps, the next state is still a perfectly valid
state, just one the agent did not get to observe. Treating it as terminal
(zeroing the bootstrap) would incorrectly tell the agent that those states
have no future value. This is a subtle bug that could hurt performance if
you get it wrong.
Running the experiment
Running train.py  with the default seed produces the following output on our
machine:

👉
The exact values can vary across machines, but the behavior would mostly
be consistent.

Also taking a look at the graphs:
First, the random phase. From episode 1 to roughly episode 200, the agent is
exploring with high , the buffer is filling up, and average returns sit around
20 to 40. The Q-network is still essentially noise.
Then is the learning phase. Roughly around episode 200 to 400, as  decays
further and the buffer accumulates more diverse transitions, the agent's
policy improves, thus improving the returns.
Post that the returns in our run mostly stayed at 500, however the case
might be different on your machine.
ϵ
ϵ

👉
Since exact values and ranges can vary across machines, what to note here
is actually the fact that our DQN learns as episodes pass.
Based on our learning and experimentation so far, we recommend exploring the
following topics as self-learning exercises:
Vanilla DQN and catastrophic forgetting.
The variants that improved vanilla DQN:
Double DQN
Dueling DQN
With that, the hands-on section concludes, and so does this chapter. In the
upcoming chapters, we will continue to build on the core ideas of RL and
explore concepts and their implementations wherever applicable.
Conclusion

In this chapter, we explored the move from linear value function approximation
to neural function approximation, and the engineering choices that made deep
value-based RL possible in practice.
We started by noting that the mechanical step from linear to neural is small. The
form of the value function generalizes from 
 to 
, and the gradient is
computed by backpropagation. What we lose in this move is the theoretical
convergence guarantees that held for linear on-policy semi-gradient TD.
We then walked through what breaks when we naively combine deep Q-
learning with online updates: sample correlation, non-stationary targets, and
the deadly triad scaled up.
The two engineering choices that fix this are experience replay and target
networks. Experience replay stores transitions in a buffer and samples
minibatches uniformly at random, decorrelating the training data and
improving sample efficiency. Target networks maintain a frozen copy of the Q-
network, used only to compute the bootstrap target, making Chapter 5's semi-
gradient pretense literal.
The full DQN algorithm puts these pieces together: Q-learning with a neural
network for the action-value function, -greedy exploration, experience replay, a
θ⊤ϕ(s)
fθ(s)
ϵ

target network updated every 
 steps, and the Huber loss for robustness.
Finally, the hands-on section implemented DQN from scratch in PyTorch and
trained it on CartPole.
Continuing our journey further, in the next chapter, we will explore and learn
about policy gradients.
The aim, as always, is to build a strong conceptual foundation and equip you
with a flexible framework for reasoning about the core principles and the
broader landscape in general.
As always, thanks for reading!
Any questions?
Feel free to post them in the comments.
Or
If you wish to connect privately, feel free to initiate a chat here:
C

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Published on May 31, 2026
Previous
Next
Comments
Share
Function Approximation
-

---

## Part 7: Policy Gradients_ REINFORCE and Actor-Critic

*Source: `7-Policy Gradients_ REINFORCE and Actor-Critic.pdf`*

-
RL Part 7: Learning the policy directly, from REINFORCE to actor-critic.
Recap
In chapter 6, we moved from linear value function approximation to neural
networks.
The value function generalized from a linear form to a neural network. What
we gave up in that move was the convergence guarantee that held for linear on-
policy methods.

-

We then saw what breaks when deep networks meet online Q-learning:
correlated samples, moving targets, and the deadly triad scaled up. Two
engineering fixes carried the day:
Experience replay stored past transitions and sampled them in random
minibatches, breaking correlation.

-

Target networks froze a copy of the Q-network to compute stable bootstrap
targets.
Putting these together gave us DQN algorithm, which we trained from scratch
on CartPole.
If you have not read Chapter 6, we recommend doing so first:

-

Now most of the methods we learned so far share one trait. They learn how
good actions are, then derive behavior by picking the best-scoring action. That
works beautifully when actions are few and discrete. It strains badly when
actions are continuous or numerous.
Hence, there is another way. Instead of scoring actions and choosing among
them, we can learn the choosing itself. That is the subject of this chapter.
As for this part, we will focus on policy gradient methods. We will build the
policy gradient from first principles, meet REINFORCE, confront its variance
problem head-on, and learn about the actor-critic architecture.
Let's begin!
Introduction to Deep RL and DQN
RL Part 6: From linear features to neural networks, and the engineering
choices that makes deep value-based RL possible.
Daily Dose of Data Science • Avi Chawla

-

Two ways to solve a control problem
A reinforcement learning agent needs a policy: a rule that says what to do in
each state. Up to now, we built that rule indirectly. We learned a value function,
an estimate of how much reward we can expect, and then acted greedily with
respect to it. The policy was a byproduct of the values.
Policy gradient methods flip this around. They parameterize the policy directly
and learn its parameters. We write the policy as a function with its own weights,
and we adjust those weights to get better behavior.

-

Let us make this concrete. A policy maps a state to a distribution over actions.
We denote it as follows:
Here  is the policy,  are its learnable parameters (the weights of a neural
network),  is the current state, and  is an action.
π
θ
s
a

-

👉
The expression 
 reads as the probability of taking action  given
that we are in state , under the policy defined by parameters .
This is a stochastic policy and for continuous actions, the network typically
outputs the mean and spread of a Gaussian distribution, and we sample from it.
👉
An important point or trade-off, however, is that policy gradient methods
are on-policy and tend to be sample-hungry. Each update uses data from
the current policy, and once we update, that data is stale.
To learn the policy directly, we need an objective: a single number measuring
how good the policy is, which we can then push upward. The natural choice is
the expected return:
In this expression:
πθ(a ∣s)
a
s
θ

-

is the objective we want to maximize, written as a function of the
policy parameters .
The symbol  (tau) denotes a trajectory, the full sequence of states and
actions in an episode.
The notation 
 means the trajectory is generated by following the
current policy.
The term 
 is the total return collected along that trajectory.
 is the expectation, the average over all the trajectories the policy could
produce.
👉
Reading the structure: we run the policy, collect trajectories, sum up the
reward in each, and average. A larger 
 means the policy collects more
reward on average. Our entire goal reduces to one thing: adjust  to make
 as large as possible.
The intuition is direct. If we can compute the gradient of  with respect to , we
can climb it.
J(θ)
θ
τ
τ ∼πθ
R(τ)
E[⋅]
J(θ)
θ
J(θ)
J
θ

-

In summary, policy gradient methods learn a parameterized policy by
maximizing expected return through gradient ascent. The challenge, which the
next section solves, is computing that gradient at all.
The log-derivative trick and the policy gradient
theorem
We want the gradient of 
, but there is an immediate obstacle. The objective
is an expectation over trajectories, and the distribution of those trajectories
itself depends on .
Changing the parameters changes which trajectories we see. We cannot simply
differentiate inside the average, because the thing we are averaging over is
moving as we differentiate.
This is where one elegant identity rescues us. It is called the log-derivative trick,
and it rests on a basic fact from calculus. The derivative of the natural logarithm
of a function is the derivative of the function divided by the function itself:
J(θ)
θ

-

Rearranging it gives the form we actually use: 
.
Why does this matter? It converts a gradient of a probability into the probability
times a gradient of a log-probability. The first form is hard to average over by
sampling. The second form is exactly an expectation, which we can estimate by
sampling. That single conversion is what makes the whole method work.
Applying this trick to our objective and working through the algebra of a
trajectory's probability gives the central result of the field, the policy gradient
theorem:
∇θp(x) = p(x)∇θ log p(x)
Sign Out
Account
-

-

For each action in the trajectory, we compute how the log-probability of that
action would change as we nudge the parameters. We weight that direction by
the return of the whole trajectory. Then we sum over the trajectory and average
over many trajectories.
The intuition is the heart of the method. The gradient pushes up the probability
of actions that led to high return and pushes down the probability of actions
that led to low return.
👉
If a trajectory earned a large reward, every action in it gets reinforced. If it
earned little, every action gets discouraged. Good outcomes make their
actions more likely, bad outcomes make their actions less likely.

-

👉
Important: Policy gradients are model-free.
In summary, the log-derivative trick turns an intractable gradient into a sample-
able expectation, and the policy gradient theorem gives us a formula we can
estimate from experience alone. The next step is turning this formula into an
algorithm.
REINFORCE

-

The policy gradient theorem tells us what the gradient is. REINFORCE tells us
how to estimate it from experience. It was the first policy gradient method.
The technique is direct:
Run the current policy to collect a full episode.
For each step, record the action's log-probability and the rewards that
followed.
After the episode ends, compute the return, weight each log-probability by
it, and take one gradient ascent step.
Repeat with a fresh episode.
👉
Because REINFORCE waits for a complete episode before computing
returns, it is a Monte Carlo method.
In practice, one refinement is almost always applied. An action taken at time 
cannot influence rewards that came before it. So instead of weighting each
action by the entire trajectory's return, we weight it only by the return collected
from that point onward, i.e., 
.
t
Gt

-

Thus, we write REINFORCE gradient estimate as the following:
This is the same shape as the policy gradient theorem, with one change. The
trajectory return 
 has been replaced by the return-to-go 
. Everything else
is identical.
👉
REINFORCE produces an unbiased estimate of the policy gradient.
Unbiased means that if we averaged over infinitely many episodes, the
estimate would equal the true gradient exactly. There is no systematic
error. This is an important property, and we will contrast it with what
comes later.
In summary, REINFORCE is the Monte Carlo policy gradient. It is simple,
principled, and unbiased. It is also, as we are about to see, painfully noisy.
R(τ)
Gt

-

The variance problem
REINFORCE is unbiased, which sounds ideal. But unbiased does not mean
reliable on any single estimate, it means correct on average. The individual
estimates can still scatter wildly around that average, and REINFORCE estimates
scatter a great deal.
Consider where the noise comes from. The return 
 is a sum of many rewards
across many steps, and each of those rewards depends on a chain of random
action choices and random environment transitions. A single lucky or unlucky
episode can produce a return far from the typical value.
👉
Since we weight the gradient by this return, the gradient inherits all of that
variability, leading to huge instability from one training run to another.
This is the variance problem. High variance means our gradient estimate jumps
around from episode to episode, even when the true gradient is steady. We end
Gt

-

up taking steps in noisy, inconsistent directions. Learning, thus, becomes
unstable.
The two most common observations are:
Because REINFORCE relies entirely on complete experience trajectories,
performance becomes highly sensitive to the initial weight initialization and
the sequence of randomly sampled episodes. Two identical models running
simultaneously with different random seeds can have entirely different
trajectories; one might master the task while the other fails to learn at all.

-

Training returns climb for hundreds of episodes, then suddenly plummet.
High variance is a major contributor: a few noisy gradient steps in the
wrong direction undo hard-won progress, and the policy struggles to
recover.

-

👉
A high-variance estimator is not wrong, it is just unreliable per sample. To
get a trustworthy gradient from a noisy estimator, you would need to
average over many episodes per update, which is exactly why basic
REINFORCE is sample-inefficient.
This sets up the central tension of the chapter. We have an unbiased gradient
that is too noisy to use well. The rest of the chapter is about reducing that noise,
ideally without giving up too much of the unbiasedness. This is a bias-variance
trade-off, and we will navigate it step-by-step.
Baselines

-

Here is the key insight:
We are weighting each action by its return. But a return of 400 does not, on its
own, tell us whether 400 was good. If every action from this state tends to yield
around 400, then 400 is merely average, and we should not strongly reinforce it.
What matters is whether an action did better or worse than expected.
So we subtract a reference value, called a baseline, from the return before
weighting. The baseline represents roughly what we expected to get. The
modified gradient estimate looks like this:
The new term is 
, the baseline evaluated at state 
. Everything else is the
REINFORCE estimate from before. We have simply replaced the raw return 
with the difference 
, how much the return exceeded our reference.
b(st)
st
Gt
Gt −b(st)

-

The remarkable fact is that subtracting a baseline does not bias the gradient at
all, as long as the baseline does not depend on the action. The estimate remains
correct on average. This follows from a property of the score function, which
states that its expected value is zero:
Let us unpack why this is zero. The expectation is over actions drawn from the
policy. Since the score function times the probability is just the gradient of the
probability, summing the gradient of the probability over all actions is the
gradient of the sum of all probabilities. But probabilities always sum to one, and
the gradient of the constant one is zero.
👉
The intuition: since the baseline multiplies the score function, and the
score function averages to zero, the baseline's contribution to the gradient
averages to zero as well.

-

This reduces the scatter. By re-centering returns around a typical value, the
weights become smaller in magnitude and more balanced between positive and
negative. Better than expected actions get a positive push, worse than expected
ones get a negative push, and the noisy common scale is removed.
👉
The baseline must not depend on the action taken. A baseline that depends
on the state is fine and is what we will use. A baseline that depends on the

-

action would break the zero-expectation property and bias the gradient.
Thus, subtracting a state-dependent baseline reduces variance without
introducing bias. The next natural question is what the best state-dependent
baseline is. The answer connects policy gradients back to value functions.
The advantage function
What is the best reference value to subtract at a given state? Intuitively, it should
be how much return we expect to collect from that state under our current
policy.
That quantity has a name we already know from earlier chapters: the state-
value function 
.
If we use 
 as our baseline, the term we weight each action by becomes the
return minus the value of the state. With the return being single-sample
estimate of the true action-value 
, this difference becomes:
V (s)
V (s)
Q(s, a)

-

is known as the advantage function.
👉
The structure is a comparison: Subtraction gives how much better or
worse this particular action ( ) is than the policy's typical behavior in that
state.
The intuition is clean and worth holding onto. A positive advantage means the
action was better than average from this state, so we should make it more likely.
A negative advantage means it was worse than average, so we should make it
less likely.
The advantage is the cleanest possible learning signal: it measures not how good
the outcome was, but how much better than expected.
A(s, a)
a

-

Substituting the advantage into the policy gradient gives the form used
throughout modern reinforcement learning:

-

This is identical in shape to every policy gradient we have written. We push up
actions with positive advantage, push down actions with negative advantage,
and the magnitude of the push scales with how far from average the action was.
So overall, the best state-dependent baseline is the value function, and using it
produces the advantage function, the signal of how much better than average an
action was. Learning that value function is what we turn to now.
Actor-critic architecture
We have now arrived at the actor-critic architecture by following one thread:
the best baseline is the value function, but the value function must be learned.
So we learn two things at once:

-

The first is the actor: the policy 
, which chooses actions.
The second is the critic: a value function 
 with its own parameters ,
which estimates how good states are.
The actor acts and the critic judges. The actor updates using the critic's judgment
as its baseline.
This is why the method is called actor-critic. The critic does not choose actions; it
only evaluates them, supplying the advantage estimate that the actor uses to
improve.
The two components are trained together but with different goals:
The actor is trained to maximize expected return, using the advantage-
weighted policy gradient we just derived.
The critic is trained to predict returns accurately, by minimizing the
squared difference between its prediction and the observed return.
This critic loss is defined as:
πθ(a ∣s)
Vϕ(s)
ϕ

-

In this loss, 
 is the critic's predicted value of the state, 
 is the actual
return observed from that state, and  are the critic's parameters.
The squared difference penalizes the critic for predictions that miss the realized
return. The structure is ordinary supervised regression: predict a number,
compare to the truth, minimize the squared error.
👉
The intuition for the whole system is that the critic learns to predict what
return to expect from each state, and the actor uses any deviation from
that prediction as its signal. When the actor stumbles into a better-than-
predicted outcome, the advantage is positive and that behavior is
reinforced. The critic, meanwhile, updates its prediction so that next time
the bar is set correctly.
Now the most important idea in this section.
Vϕ(st)
Gt
ϕ

-

The critic is an approximation. It is not the true value function, especially early
in training when it is barely trained. So the advantage estimate it produces can
be noisy or inaccurate:
But this does not mean the policy gradient is biased simply because the baseline
is approximate. As long as the baseline depends only on the state and not on the
action, subtracting it does not change the expected policy-gradient direction. It
only changes the variance.
👉
Recall the true advantage is defined as 
. We
usually cannot compute 
 directly, but the observed return-to-go 
​ is a
single-sample estimate of it. Substituting gives the estimator in the above
form.
So in this Monte Carlo version, the critic mainly acts as a learned variance-
reduction device. A learned 
 is usually a far better baseline than a single
A(st, at) = Q(st, at) −V (st)
Q
Gt
V (s)

-

constant, so the advantage estimates are much tighter, and it achieves this
without changing the expected direction of the update. The gradient remains
unbiased.
The bias-variance trade-off becomes clearer when the critic is trained with
bootstrapping. Instead of regressing toward the full Monte Carlo return 
​,
practical actor-critic methods often train the critic against a one-step TD target:
This replaces the full future return with one real reward plus the critic's own
estimate of what comes next. That is bootstrapping, and this is where bias is
genuinely introduced: the target now depends on the critic's own imperfect
prediction, not on actual sampled return. This can be used directly as a low-
variance estimate of the advantage.
The same one-step quantity also gives the TD error:
Gt

-

This lets the actor update after a single step instead of waiting for the whole
episode to finish. The cost is that the learning signal is now partly based on the
critic's current estimate of the future.
This is the bias-variance trade-off in its clearest form. Full Monte Carlo returns
use only real sampled rewards, so they carry no bias but high variance. One-
step TD targets use bootstrapping, so they usually have lower variance but
introduce bias. Actor-critic methods live on this spectrum.
👉
In code, the actor and critic often share the lower layers of a network and
split into two heads near the output. Sharing features can speed learning,
but it also means the two losses interact, which is why their relative
weighting becomes a tuning knob.
Using more real reward before bootstrapping reduces bias at the cost of
variance; using less real reward and bootstrapping earlier reduces variance at
the cost of bias. The full Monte Carlo return sits at one end of this spectrum, and

-

one-step TD sits at the other. This spectrum is exactly what the next section
generalizes.
Generalized advantage estimation
We are left with an awkward choice. The one-step TD advantage has low
variance but leans heavily on the imperfect critic, giving it bias. The full Monte
Carlo advantage has no such bias but high variance. In between sit the n-step
estimates, which use  real rewards before bootstrapping from the critic.
Each point on this spectrum has its own bias-variance balance, and picking one
means committing to a single compromise.
n

-

Generalized advantage estimation (GAE), removes the need to choose. Instead of
selecting one estimate, it blends all of them together with exponentially
decaying weights:

-

The symbols:
​ is the GAE advantage estimate at time .
The term 
​ is the TD error  steps into the future, which, written with
timestep indices, is 
.
The discount .
The new parameter  is a number between zero and one that controls the
decay.
The sum runs over all future steps, with each TD error weighted by 
,
so errors further ahead count for geometrically less.
The structure is an exponentially weighted average of TD errors. Near-term
errors dominate; distant ones fade. The single knob  sets how fast they fade,
and that knob is the bias-variance dial made continuous.
^A
GAE
t
t
δt+k
k
δt = rt+1 + γV (st+1) −V (st)
γ
λ
(γλ)k
λ

-

The intuition lives at the extremes:
When 
, only the first TD error survives, and GAE collapses to the one-
step estimate: low variance, higher bias.
When 
, the weights stop decaying beyond the discount, and GAE
becomes the full Monte Carlo advantage: high variance, low bias.
Any value in between smoothly interpolates. Rather than choosing a
discrete , we turn a continuous dial.
👉
GAE is a core ingredient of Proximal Policy Optimization (PPO), the
algorithm most associated with tuning language models. When we reach
PPO in a later chapter, GAE will already be familiar.
In summary, GAE generalizes the n-step advantage into a single exponentially-
weighted estimator, with  tuning the bias-variance balance continuously. With
this, we have a full toolkit for low-variance policy gradients. It is time to see
where all of this leads.
λ = 0
λ = 1
n
λ

-

The connection to language models
Everything in this chapter underlies how large language models are tuned with
reinforcement learning, and the mapping is exact.
In the RL setting:
A language model is a policy. Given the text so far, it outputs a probability
distribution over the next token and samples from it. The state  is the prompt
plus the tokens generated so far, the action  is the next token and 
 is
the model itself.
👉
Generating a response is rolling out a trajectory, sampling token after
token until the sequence ends.
This also answers a question the chapter opened with: why learn a policy
directly at all, instead of values? Here the answer is unavoidable. The action
space is the entire vocabulary, tens of thousands of tokens. The value-based
method, estimates a value for every action and takes the 
, which is ugly
at the scale of LMs.
s
a
πθ(a ∣s)
arg max

-

A model that directly emits token probabilities sidesteps the problem entirely,
because it is a policy by construction. Policy gradients are not one option among
several for language models. They are essentially the exact option, which is why
this chapter, is also the foundation for modern LLM tuning.
The variance problem we spent this chapter fighting is acute in this setting.
Trajectories are long, often hundreds of tokens, and the action space is
enormous. A naive REINFORCE-style estimate would be hopelessly noisy. The
baseline, the advantage function, and GAE are not optional niceties here; they
are what make the training stable enough to work at all.
We will not go in depth or build the full pipeline here. The greater and deeper
details are for later chapters. But the engine underneath all of it is already in
your hands. It is the policy gradient we studied here.
We have now understood all the key concepts for this chapter. The pieces are in
place. So let's go ahead and dive into hands-on section for some practical
experimentation.

-

Hands-on: REINFORCE on CartPole
We will now implement REINFORCE and watch the variance issue play out in
real training.
The code and project setup are attached below as a zip file. You can extract it
and run  uv sync  to get going.
Download the zip file below:
reinforce
reinforce.zip
For details about versions and dependencies, check the  .python-
version  and  pyproject.toml  files.
• 203 KB

-

The environment
We use CartPole-v1, the same environment as Chapter 6, so the comparison is
grounded in something familiar. An episode return of 500 is the maximum.
REINFORCE
Firstly let's import required libraries and set our variables and
hyperparameters:

-

Now let's define a small policy network, collects one episode at a time, computes
the return-to-go for each step, and takes a single gradient ascent step per
episode:

-

-

This is REINFORCE in its purest form: no baseline, no normalization, just the
Monte Carlo policy gradient exactly as the theorem states it.
Walking through what the code does:

-

It defines PolicyNet , a two-layer network that maps a state to action logits.
The logits are left raw because the categorical distribution applies the
softmax internally when we sample.
discounted_returns  computes the return-to-go for every step, accumulating
rewards backward through time with the discount factor so each value is
found in a single pass.
The run  function holds the training loop. Inside its for ep in range(EPISODES)
loop, each iteration handles one episode: it resets the environment, then
runs a full rollout, at each step sampling an action from the policy's
categorical distribution, storing that action's log-probability (the score
function), stepping the environment, and recording the reward, until the
episode ends.
👉
Collecting the whole episode before updating is what makes this a Monte
Carlo method.
After the episode, the loss is the negative sum over timesteps of each log-
probability weighted by its return-to-go. The sum is the theorem's within-

-

trajectory term; the single episode is an unbiased one-sample estimate of
the expectation over trajectories.
👉
The negative is only because optimizers minimize while we want to
ascend.
Then run  does one backward pass and one optimizer step to update the
policy, logs the episode's total reward to history , and moves to the next
episode. No baseline, no normalization, this is raw REINFORCE, which is
why the variance problem is so visible when we plot the results.
moving_avg  is a plotting helper that smooths the noisy per-episode returns
with a sliding window so the learning trend is readable.
Finally, let's take a look at the driver code:

-

We run it across five random seeds to see how the algorithm behaves run-to-run
and generate the plot.
Here is the plot we got on running the code:

-

👉
The exact curves can vary across machines, but the behavior would mostly
be consistent.
The plot is the variance problem made visible. Every seed climbs somewhere or
the other, but not able to holds its gains. Each curve oscillates violently, peaking,
crashing back toward 100, then climbing again, throughout all 600 episodes.

-

This is not a bug. It is exactly what the theory predicts. Vanilla REINFORCE
weights every action by the noisy Monte Carlo return 
, and a single unlucky
moment can produce a gradient that pushes the policy off a hard-won peak.
The five seeds also disagree wildly with one another, which is the same variance
viewed across runs rather than across time.
Now, as a self-learning exercise, readers are encouraged to extend this in a few
directions:
Add a simple baseline.
Then add a learned value baseline to form an actor-critic, using the TD error
as the advantage.
Vary the learning rate and observe the different plots.
With that, the hands-on section concludes, and so does this chapter. In the
upcoming chapters, we will continue to build on the core ideas of RL and
explore concepts and their implementations wherever applicable.
Gt

-

Conclusion
In this chapter, we explored policy gradient methods, the family that learns
behavior directly.
We began by contrasting value-based and policy-based control, and
parameterized the policy directly to maximize expected return.
We then built the policy gradient from first principles: the log-derivative trick
turned an intractable gradient into a sample-able expectation, and the policy
gradient theorem gave us a formula estimable from experience, with the
environment dynamics dropping out entirely.
REINFORCE turned that formula into the first policy gradient algorithm, simple
and unbiased.
We then confronted its central weakness, high variance. The fix unfolded in
stages:
A baseline reduced variance without introducing bias.
Then the best state-dependent baseline turned out to be the value function,
which gave us the advantage function, the signal of how much better than

-

average an action was.
Learning that value function alongside the policy produced the actor-critic
architecture, reducing variance through a learned baseline and with
bootstrapping, it trades some bias for further variance reduction.
We then connected the whole chapter to language models, where the model is a
policy over tokens and human-feedback (RLHF) tuning is advantage-based
policy gradients at scale. We will be diving deeper into these topics in the later
chapters.
Finally, the hands-on section implemented the REINFORCE algorithm and
trained on CartPole.
In the next chapter, we will build on the foundations and learn about proximal
policy optimization.
The aim, as ever, is to develop a solid system-level perspective and to equip you
with an adaptable engineering framework for building AI systems that are
robust and maintainable.
As always, thanks for reading!

-

A daily column with insights, observations, tutorials and best
practices on python and data science. Read by industry
professionals at big tech, startups, and engineering students.
Menu
Contact
FAQ
Daily Dose of Data Science © 2026
Any questions?
Feel free to post them in the comments.
Or
If you wish to connect privately, feel free to initiate a chat here:
Published on Jun 7, 2026
Previous
Comments
Share
Introduction to Deep RL and DQN

-

---
