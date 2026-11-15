from contextlib import contextmanager
from time import perf_counter

@contextmanager
def timer(label="Block"):
    start = perf_counter()
    try:
        yield
    finally:
        print(f"{label} took {perf_counter() - start:.3f} seconds")