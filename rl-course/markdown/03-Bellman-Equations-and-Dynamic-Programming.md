# Bellman Equations and Dynamic Programming

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
