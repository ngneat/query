# Changelog

# 2.0.0-beta.0

### Features
- Update to tanstack v5
- Introduce signal API
- Add additional operators

### Breaking Changes
- Angular v16 is required
- Persisted Query Removed
- Mutation Result Removed
- Constructor DI Removed. You should now use the inject functions version
- Change operators name to include result in the name. For example, `filterSuccess => filterSuccessResult`
