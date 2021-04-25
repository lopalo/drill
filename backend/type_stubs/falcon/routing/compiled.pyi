# Stubs for falcon.routing.compiled (Python 3.7)
#
# NOTE: This dynamically typed stub was automatically generated by stubgen.

from six.moves import UserDict
from typing import Any, Optional

class CompiledRouter:
    def __init__(self) -> None: ...
    @property
    def options(self): ...
    @property
    def finder_src(self): ...
    def add_route(self, uri_template: Any, method_map: Any, resource: Any): ...
    def find(self, uri: Any, req: Optional[Any] = ...): ...

class CompiledRouterNode:
    children: Any = ...
    raw_segment: Any = ...
    method_map: Any = ...
    resource: Any = ...
    uri_template: Any = ...
    is_var: bool = ...
    is_complex: bool = ...
    num_fields: int = ...
    var_name: Any = ...
    var_pattern: Any = ...
    var_converter_map: Any = ...
    def __init__(self, raw_segment: Any, method_map: Optional[Any] = ..., resource: Optional[Any] = ..., uri_template: Optional[Any] = ...) -> None: ...
    def matches(self, segment: Any): ...
    def conflicts_with(self, segment: Any): ...

class ConverterDict(UserDict):
    def update(self, other: Any) -> None: ...
    def __setitem__(self, name: Any, converter: Any) -> None: ...

class CompiledRouterOptions:
    converters: Any = ...
    def __init__(self) -> None: ...

class _CxParent:
    def __init__(self) -> None: ...
    def append_child(self, construct: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxIfPathLength(_CxParent):
    def __init__(self, comparison: Any, length: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxIfPathSegmentLiteral(_CxParent):
    def __init__(self, segment_idx: Any, literal: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxIfPathSegmentPattern(_CxParent):
    def __init__(self, segment_idx: Any, pattern_idx: Any, pattern_text: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxIfConverterField(_CxParent):
    def __init__(self, field_name: Any, converter_idx: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxSetFragmentFromField:
    def __init__(self, field_name: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxSetFragmentFromPath:
    def __init__(self, segment_idx: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxSetParamsFromPatternMatch:
    def src(self, indentation: Any): ...

class _CxSetParamsFromPatternMatchPrefetched:
    def src(self, indentation: Any): ...

class _CxPrefetchGroupsFromPatternMatch:
    def src(self, indentation: Any): ...

class _CxReturnNone:
    def src(self, indentation: Any): ...

class _CxReturnValue:
    def __init__(self, value_idx: Any) -> None: ...
    def src(self, indentation: Any): ...

class _CxSetParam:
    def __init__(self, param_name: Any, segment_idx: Any) -> None: ...
    def src(self, indentation: Any): ...
