import Backgrounds from './commons/Background'
import Margins from './commons/Margin'
import Paddings from './commons/Padding'
import Grids from './commons/Grid'
import Views from './commons/View'
import Columns from './commons/Column'
import Headers from './commons/Header'

import Link from './commons/Link'
import BreakLine from './commons/BreakLine'
import Tag from './commons/Tag'
import Paper from './commons/Paper'

import SelectWithBackend from './with_backend/SelectWithBackend'

import LabelWithFetcher from './with_fetcher/LabelWithFetcher'
import TernaryLabelWithFetcher from './with_fetcher/TernaryLabelWithFetcher'
import TernaryTagWithFetcher from './with_fetcher/TernaryTagWithFetcher'

import ButtonWithAction from './with_action/ButtonWithAction'

const All = {
	...Backgrounds,
	...Margins,
	...Paddings,
	...Grids,
	...Views,
	...Columns,
	...Headers,

	Link,
	BreakLine,
	Tag,
	Paper,

	SelectWithBackend,

	LabelWithFetcher,
	TernaryLabelWithFetcher,
	TernaryTagWithFetcher,

	ButtonWithAction,
}

export default All
