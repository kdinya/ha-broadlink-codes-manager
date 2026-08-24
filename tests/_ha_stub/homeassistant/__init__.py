"""Minimal stand-in for the ``homeassistant`` package.

This is NOT Home Assistant. It exists so that
``custom_components/broadlink_codes_manager`` (which imports real HA
modules at module scope) can be imported and unit-tested here without
pulling in the entire Home Assistant core dependency tree, which is far
heavier than this integration's own logic needs to be tested.

It stubs only the surface actually touched by this integration:
service registration/dispatch, config entries, entity platforms, and
panel/static-path registration. Anything not listed here was never
called by the code under test.

For true end-to-end testing against a live Home Assistant instance,
use ``pytest-homeassistant-custom-component`` instead - see
tests/README.md.
"""
