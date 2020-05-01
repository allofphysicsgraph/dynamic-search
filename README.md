# dynamic-search
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
