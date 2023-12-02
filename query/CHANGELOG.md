# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [2.0.0-beta.8](https://github-personal/ngneat/query/compare/query-2.0.0-beta.7...query-2.0.0-beta.8) (2023-12-02)


### Features

* **query:** 🔥 add update options method ([7a4c656](https://github-personal/ngneat/query/commit/7a4c656d7fce99ef22594ae14e5bd7be8b3aafa0))



# [2.0.0-beta.7](https://github-personal/ngneat/query/compare/query-2.0.0-beta.6...query-2.0.0-beta.7) (2023-11-27)


### Bug Fixes

* **query:** 🐞 fix operators types ([7f7c87d](https://github-personal/ngneat/query/commit/7f7c87df361c30f0984100fbabad0d6d6ea72ccd))



# [2.0.0-beta.6](https://github-personal/ngneat/query/compare/query-2.0.0-beta.5...query-2.0.0-beta.6) (2023-11-27)


### Bug Fixes

* **query:** 🐞 use QueryObserverBaseResult ([fd287b7](https://github-personal/ngneat/query/commit/fd287b71ffe6ee70fd1d27354b3f13c755f727b4))



# [2.0.0-beta.5](https://github-personal/ngneat/query/compare/query-2.0.0-beta.4...query-2.0.0-beta.5) (2023-11-27)


### Features

* **query:** 🔥 add createSyncObserverResult ([dadf325](https://github-personal/ngneat/query/commit/dadf325d5809108c0f628e06845b4f311ad317ab))



# [2.0.0-beta.4](https://github-personal/ngneat/query/compare/query-2.0.0-beta.3...query-2.0.0-beta.4) (2023-11-23)


### Bug Fixes

* **query:** 🐞 pass option to mutate function ([9732fa8](https://github-personal/ngneat/query/commit/9732fa82ef938842e26d1c9532f0575bdcd4341e))



# [2.0.0-beta.3](https://github-personal/ngneat/query/compare/query-2.0.0-beta.2...query-2.0.0-beta.3) (2023-11-23)


### Features

* **query:** 🔥 add mutateAsync function ([d42789e](https://github-personal/ngneat/query/commit/d42789eabc37ef871ce992b6d2867c6d96bbd913))



# [2.0.0-beta.2](https://github-personal/ngneat/query/compare/query-2.0.0-beta.1...query-2.0.0-beta.2) (2023-11-18)



# [2.0.0-beta.1](https://github-personal/ngneat/query/compare/query-2.0.0-beta.0...query-2.0.0-beta.1) (2023-11-16)


### Features

* **query:** 🔥 add `injectIsFetching` ([711c853](https://github-personal/ngneat/query/commit/711c853b3628a80e2a519422a2c075b84d1ee336))
* **query:** 🔥 add `injectIsMutating` ([05eb749](https://github-personal/ngneat/query/commit/05eb7497edd427b4777fee65eb967fdb915f7f06))
* **query:** 🔥 add `injectMutation` to query ([a6bdce6](https://github-personal/ngneat/query/commit/a6bdce6c186218413b025524187ddc68c78abcb8))
* **query:** 🔥 add experimental intersect signal support ([2dce8e0](https://github-personal/ngneat/query/commit/2dce8e0b2e1d9703ded751db9becd8a35d68813c))
* **query:** 🔥 add experimental signal support ([093e053](https://github-personal/ngneat/query/commit/093e053f95a97d205fc0a73a2901dbca820b844e))
* **query:** 🔥 add injector option ([f05c83b](https://github-personal/ngneat/query/commit/f05c83bb2f6e05d1e3d66683f9377712512eb659))
* **query:** 🔥 add takeUntilFinalize operator ([59983b8](https://github-personal/ngneat/query/commit/59983b8360f98f8d519189fbd18a69a0e50c1b43))
* **query:** 🔥 change set to update options ([1408655](https://github-personal/ngneat/query/commit/140865563a312e972e5988057a8d229e0dd5a761))
* **query:** 🔥 improve query options ([b47471c](https://github-personal/ngneat/query/commit/b47471cba29253dece41fb83a13cf97534fcbfe6))
* **query:** 🔥 support queryFn in query function ([caca282](https://github-personal/ngneat/query/commit/caca282d20c96630fa6f7fe03eac4c348344d8b3))



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
