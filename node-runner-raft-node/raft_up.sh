#!/bin/bash

# Run raft_node.js with arg1 in terminal 1
gnome-terminal --tab --title="node 1" -- bash -c "node raft_node.js arg1; bash"

# Run raft_node.js with arg2 in terminal 2
gnome-terminal --tab --title="node 2" -- bash -c "node raft_node.js arg2; bash"

# Run raft_node.js with arg3 in terminal 3
gnome-terminal --tab --title="node 3" -- bash -c "node raft_node.js arg3; bash"

# Run raft_node.js with arg4 in terminal 4
gnome-terminal --tab --title="node 4" -- bash -c "node raft_node.js arg4; bash"

# Run raft_node.js with arg5 in terminal 5
gnome-terminal --tab --title="node 5" -- bash -c "node raft_node.js arg5; bash"
