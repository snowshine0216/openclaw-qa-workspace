# 
BCIN-5335_Ability to create cube-based report in Library Web


## EndToEnd - P2 ([MAIN CATEOGY])

### Workstation & Library ([SUB CATEGY])

- Open Report Creator [(STEPS])

	- Select Cube Tab

		- Browse Datasets

			- Select Cube

				- New Report
				 
				 - New report can be created successully [(EXPECTED RESULT IN LEAF NODE)]

### Report Type

- OLAP cube
- MTDI cube

### Report execution after creation

## Report Creator Dialog 

### Cube Tab

- New "Cube" tab appears in the Report Creator dialog alongside existing tabs - P1 ([MARK Priority in sub category / steps if needed])
- Tab switching works correctly between Schema and Cube tabs
- switch to project that has no privilege
- re-open

	- show last select tab(per user, per app?)

- Workstation

	- switch Environment

### Object Browser in Cube Tab

- Object browser shows only folders and supported datasets (cubes)

	- Only In-Memory MTDI cubes and OLAP cubes are selectable
	- DDA cubes, MDX and Mosaic,  Live Intelligent off-memory cubes are correctly filtered out 

- Navigation through folder hierarchy works properly
- Cube/Dataset selection and highlighting functions correctly

### Cube Selection Validation

- "Create" button is disabled when no cube is selected
- "Create" button is enabled when a valid cube is selected
- Cancel cube

	- Dialog closes, no report created

## Error handling / Special cases

### timeout / network error when during creation

### Invalid cube state

- select unpublished cube

	- create

		- error msg shown

## Security Test

### cube acl

- should only show accessible cube (need to check which acl is required)

### privilege

- no Web define Intelligent Cube Report or no Defined Intelligence Cube Report
- project level 

## Pendo

## performance

### cube large list

## Platform

### browser

- Chroma / Edge / Safari

### system

- mac
- windows

## upgrade  / compatability

### Workstation

- connect to 25.12

	- won't show cube tab

## Accessibility

## Embedding
### iFrame Embedding
### Native Embedding

## i18n

### new string added in report authoring mode




