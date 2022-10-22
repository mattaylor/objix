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

| (index) | objix    | lodash   | vanilla  | % Inc   | % Err |
| ------- | -------- | -------- | -------- | ------- | ----- |
| Map     | 7012.38  | 4195.86  | 1050.79  | 67.13   | 14.8  |
| Filter  | 38468.78 | 1126.07  | 1529.99  | 3316.2  | 18.86 |
| Find    | 74188.6  | 20799.43 | 15938.13 | 256.69  | 22.95 |
| KeyBy   | 9383.75  | 6485.31  |          | 44.69   | 19.94 |
| Equals  | 2297.18  | 1340.82  | 1240.04  | 71.33   | 11.84 |
| Clone   | 6170.77  | 2091.45  | 8157.8   | 195.05  | 10.62 |
| Deep    | 2594.48  | 1381.53  |          | 87.8    | 10.77 |
| Extend  | 11217.6  | 8173.79  | 4990.64  | 37.24   | 16.67 |
| Some    | 5362.03  | 3119.58  | 4735.68  | 71.88   | 9.95  |
| Every   | 91059.92 | 6736.96  | 25402.9  | 1251.65 | 20.86 |

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 1)

| (index) | objix    | lodash   | vanilla  | % Inc   | % Err |
| ------- | -------- | -------- | -------- | ------- | ----- |
| Map     | 4259.97  | 2944.87  | 866.31   | 44.66   | 12.15 |
| Filter  | 7833.53  | 1042.81  | 1282.9   | 651.19  | 10.03 |
| Find    | 76332.7  | 20380.14 | 15779.81 | 274.54  | 23.19 |
| KeyBy   | 9069.12  | 6443.92  |          | 40.74   | 21.64 |
| Equals  | 2071.18  | 1223.36  | 1161.06  | 69.3    | 10.07 |
| Clone   | 5441.61  | 1849.79  | 7005.51  | 194.17  | 9.63  |
| Deep    | 399.3    | 318.94   |          | 25.2    | 7.25  |
| Extend  | 11065.27 | 7604.92  | 4522.67  | 45.5    | 17.6  |
| Some    | 3835.54  | 2530.53  | 3581.07  | 51.57   | 9.2   |
| Every   | 88203.64 | 6055.98  | 23058.4  | 1356.47 | 21.38 |

## Ops/sec (iters: 1000, heats: 100, simple: 10, complex: 10)

| (index) | objix   | lodash  | vanilla | % Inc  | % Err |
| ------- | ------- | ------- | ------- | ------ | ----- |
| Map     | 656.5   | 680.92  | 216.47  | -3.59  | 6.55  |
| Filter  | 795.29  | 433.24  | 275.08  | 83.57  | 4.57  |
| Find    | 3741.3  | 3714.32 | 530.39  | 0.73   | 7.26  |
| KeyBy   | 9374.13 | 6412.73 |         | 46.18  | 20.06 |
| Equals  | 471.47  | 432.91  | 439.48  | 8.91   | 4.88  |
| Clone   | 984.67  | 801.21  | 294.05  | 22.9   | 4.54  |
| Deep    | 68.29   | 206.85  |         | -66.99 | 5.93  |
| Extend  | 9473.53 | 7550.47 | 230.18  | 25.47  | 12.98 |
| Some    | 725.86  | 758.97  | 408.42  | -4.36  | 4.42  |
| Every   | 3085.48 | 2110.81 | 621.44  | 46.18  | 5.98  |
