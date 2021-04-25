# Stubs for falcon.api_helpers (Python 3.7)
#
# NOTE: This dynamically typed stub was automatically generated by stubgen.

import six
from typing import Any, Optional

def make_router_search(router: Any): ...
def prepare_middleware(middleware: Optional[Any] = ..., independent_middleware: bool = ...): ...
def default_serialize_error(req: Any, resp: Any, exception: Any) -> None: ...
def wrap_old_error_serializer(old_fn: Any): ...

class CloseableStreamIterator(six.Iterator):
    stream: Any = ...
    block_size: Any = ...
    def __init__(self, stream: Any, block_size: Any) -> None: ...
    def __iter__(self): ...
    def __next__(self): ...
    def close(self) -> None: ...
