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
│     Map │ 10622.45 │ 4001.79  │ 2459.25  │ 165.44  │
│    Pick │ 26178.12 │ 2968.83  │ 2689.14  │ 781.77  │
│    Find │ 37226.56 │ 26999.64 │ 4897.54  │ 37.88   │
│ FlatMap │ 1481.84  │ 1405.22  │          │ 5.45    │
│     Has │ 36824.88 │ 15899.35 │ 12578.4  │ 131.61  │
│   KeyBy │ 2883.98  │ 2601.21  │ 3684.19  │ 10.87   │
│  Equals │ 3989.11  │ 3134.77  │ 5572.24  │ 27.25   │
│   Clone │ 7549.7   │ 4022.83  │ 3990.58  │ 87.67   │
│    Deep │ 1841.1   │ 2586.37  │ 1864.17  │ -28.82  │
│  Extend │ 24058.36 │ 13571.73 │ 2467.12  │ 77.27   │
│    Some │ 7170.91  │ 5872.27  │ 5371.82  │ 22.11   │
│  Some_A │ 40627.72 │ 1225.22  │ 4294.49  │ 3215.95 │
│   Every │ 35733.32 │ 15848.64 │ 12010.49 │ 125.47  │

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 1)

| (index) | objix    | lodash   | vanilla  | % Inc   |
| ------- | -------- | -------- | -------- | ------- |
│     Map │ 6739.14  │ 3176.74  │ 2088.01  │ 112.14  │
│    Pick │ 16006.5  │ 2731.37  │ 3202.51  │ 486.02  │
│    Find │ 37933.88 │ 27340.86 │ 4553.51  │ 38.74   │
│ FlatMap │ 1305.3   │ 1254.27  │          │ 4.07    │
│     Has │ 37154.08 │ 14478.59 │ 11648.73 │ 156.61  │
│   KeyBy │ 2842.61  │ 2605.07  │ 3745.13  │ 9.12    │
│  Equals │ 3433.16  │ 2739.87  │ 4512.44  │ 25.3    │
│   Clone │ 5889.73  │ 3462.88  │ 3469.62  │ 70.08   │
│    Deep │ 523.83   │ 508.16   │ 527.43   │ 3.08    │
│  Extend │ 22977.48 │ 13296.33 │ 2302.89  │ 72.81   │
│    Some │ 6564.56  │ 4667.97  │ 4667.87  │ 40.63   │
│  Some_A │ 43127.9  │ 1214.74  │ 4235.1   │ 3450.38 │
│   Every │ 35423.81 │ 14215.27 │ 10941.42 │ 149.2   │

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 10)

| (index) | objix   | lodash  | vanilla | % Inc  |
| ------- | ------- | ------- | ------- | ------ |
│     Map │ 1902.76  │ 1530.73  │ 1048.79 │ 24.3    │
│    Pick │ 3897.36  │ 1499.51  │ 1422.15 │ 159.91  │
│    Find │ 38345.44 │ 26951.64 │ 2638.14 │ 42.27   │
│ FlatMap │ 629.73   │ 617.82   │         │ 1.93    │
│     Has │ 37568.96 │ 10736.26 │ 7461.6  │ 249.93  │
│   KeyBy │ 2822.14  │ 2588.96  │ 3636.15 │ 9.01    │
│  Equals │ 1702.74  │ 1551.39  │ 2089.75 │ 9.76    │
│   Clone │ 2427.55  │ 2054.74  │ 2032.86 │ 18.14   │
│    Deep │ 347.11   │ 365.41   │ 347.09  │ -5.01   │
│  Extend │ 24086.9  │ 13024.44 │ 1517.68 │ 84.94   │
│    Some │ 3746.86  │ 3002.35  │ 2676.28 │ 24.8    │
│  Some_A │ 41357.96 │ 1211.05  │ 4263.52 │ 3315.05 │
│   Every │ 35497.08 │ 10573.09 │ 7008.82 │ 235.73  │

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 100

| (index) | objix   | lodash  | vanilla | % Inc |
| ------- | ------- | ------- | ------- | ----- |
│     Map │ 210.73   │ 208.79   │ 163.14  │ 0.93    │
│    Pick │ 472.73   │ 240.09   │ 231.87  │ 96.9    │
│    Find │ 38630.64 │ 27390.92 │ 531.16  │ 41.03   │
│ FlatMap │ 77.09    │ 78.47    │         │ -1.76   │
│     Has │ 37054.08 │ 3050.04  │ 2036.28 │ 1114.87 │
│   KeyBy │ 2774.67  │ 2514.64  │ 3666.21 │ 10.34   │
│  Equals │ 247.81   │ 240.37   │ 281.5   │ 3.1     │
│   Clone │ 305.31   │ 369.46   │ 325.99  │ -17.36  │
│    Deep │ 82.13    │ 87.95    │ 82.05   │ -6.62   │
│  Extend │ 22896.51 │ 12269.11 │ 293.57  │ 86.62   │
│    Some │ 712.33   │ 586.29   │ 536.57  │ 21.5    │
│  Some_A │ 42950.36 │ 1215.88  │ 4179.76 │ 3432.45 │
│   Every │ 35625.08 │ 2911.27  │ 2040.24 │ 1123.7  │
