# Benchmarks <!-- {docsify-ignore} -->

Performance of some common operations can be compared to lodash using the [benchmarks](../bench.js) script.

```bash
> node bench <iterations=1000> <heats=100> <simple=10> <complex=1>
```

|              |                                              |
| ------------ | -------------------------------------------- |
| `iterations` | Number of iterations per heat                |
| `heats`      | Number of randomised heats                   |
| `simple`     | Number of simpled properties per test object |
| `complex`    | Number of complex properties per test object |

This script prints out a table of average operations per secs for each test function
for lodash, objix and a basic vanilla alternative together with the mean error coefficient accross the heats and the % performance improvments of objix against lodash.

For simple object objix performs insanely well, but this drops off quickly when more complex objects are tested.

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 0)

| (index) | objix    | lodash   | vanilla  | % Inc   | 
| ------- | -------- | -------- | -------- | ------- | 
|   Map   | 7142.03  | 4298.38  | 1127.06  |  66.16  |
|  Pick   | 33719.36 | 1087.62  | 1461.99  | 3000.29 |
|  Find   | 66752.42 | 18973.02 | 15893.9  | 251.83  |
| FlatMap | 1110.51  |  355.17  |          | 212.67  |
|   Has   | 65836.27 | 7888.75  | 24197.48 | 734.56  |
|  KeyBy  | 9133.08  | 6544.81  |          |  39.55  |
| Equals  | 1737.02  | 1233.47  | 1044.99  |  40.82  |
|  Clone  |   4376   | 1922.19  |  8294.3  | 127.66  |
|  Deep   | 1645.25  | 1260.17  |  851.08  |  30.56  |
| Extend  | 10144.26 | 7109.84  | 5162.03  |  42.68  |
|  Some   |  5271.2  | 3072.82  | 4621.69  |  71.54  |
|  Every  | 88876.52 | 6520.33  | 24020.42 | 1263.07 |
## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 1)

| (index) | objix    | lodash   | vanilla  | % Inc   |
| ------- | -------- | -------- | -------- | ------- |
|   Map   | 4020.67  | 2894.56  |  906.19  |  38.9   |
|  Pick   | 7381.27  |  975.38  | 1227.37  | 656.76  |
|  Find   | 73082.8  | 19661.19 | 15543.57 | 271.71  |
| FlatMap |  917.68  |  324.11  |          | 183.14  |
|   Has   | 67305.88 | 7191.75  | 22832.16 | 835.88  |
|  KeyBy  | 8617.11  | 6198.98  |          |  39.01  |
| Equals  | 1471.97  | 1061.28  | 1015.04  |  38.7   |
|  Clone  | 3971.84  | 1703.93  | 7140.16  |  133.1  |
|  Deep   |  392.24  |  306.98  |  406.49  |  27.77  |
| Extend  | 10413.76 | 6539.65  | 4816.44  |  59.24  |
|  Some   | 3815.55  | 2460.84  | 3541.65  |  55.05  |
|  Every  | 87646.46 | 5991.74  |  22612   | 1362.79 |

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 10)

| (index) | objix   | lodash  | vanilla | % Inc  |
| ------- | ------- | ------- | ------- | ------ |
|   Map   | 634.32  | 662.87  | 213.74  | -4.31  |
|  Pick   |   684   | 411.98  | 260.69  | 66.03  |
|  Find   | 3503.18 | 3686.66 | 495.96  | -4.98  |
| FlatMap |  340.7  | 140.71  |         | 142.13 |
|   Has   | 3130.16 | 2332.44 | 669.67  |  34.2  |
|  KeyBy  | 8707.16 | 6251.42 |         | 39.28  |
| Equals  | 452.59  | 451.46  | 442.06  |  0.25  |
|  Clone  |  1094   | 771.83  | 285.42  | 41.74  |
|  Deep   | 253.57  | 197.59  | 280.24  | 28.33  |
| Extend  | 9176.29 | 7561.72 | 224.22  | 21.35  |
|  Some   | 697.46  | 705.36  | 384.15  | -1.12  |
|  Every  | 2793.43 | 1926.93 | 597.55  | 44.97  |