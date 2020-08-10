# dynamic-search

[![Join the chat at https://gitter.im/allofphysicsgraph/graph-search](https://badges.gitter.im/allofphysicsgraph/graph-search.svg)](https://gitter.im/allofphysicsgraph/graph-search?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

search a graph using a webform

The list of nodes is in compute.py and contains

```python
node_list = ['94922', '9913', '4241','4942', '49424', '242492', '13942']
```

Desired behavior:
1. user types "9"
1. only nodes with the string "9" remain in the window
1. user types another digit, now the input is "94"
1. only nodes with "94" are displayed
