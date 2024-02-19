/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {Liferay} from '../services/liferay/liferay.js';

let oAuth2Client;

try {
	oAuth2Client = Liferay.OAuth2Client.FromUserAgentApplication(
		'kong-httpbin-oauth-application-user-agent'
	);
}
catch (error) {
	console.error(error);
}

function HttpBin() {
	const [mockGet, setMockGet] = React.useState(null);

	React.useEffect(() => {
		oAuth2Client?.fetch('/mock/get').then((mockGet) => {
			setMockGet(mockGet);
		});
	}, []);

	return !mockGet ? (
		<div>Loading...</div>
	) : (
		<div>
			<h2>HttpBin Mock Get Response</h2>

			<code>
				{JSON.stringify(mockGet, null, 2)}
			</code>
		</div>
	);
}

export default HttpBin;
