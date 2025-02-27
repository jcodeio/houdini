import { test } from '@playwright/test'
import { routes } from '~/utils/routes'
import { sleep } from '~/utils/sleep'
import { expect_to_be, goto } from '~/utils/testsHelper'

test('Route params', async ({ page }) => {
	await goto(page, routes.route_params)

	// be default we see user 1
	await expect_to_be(page, '1:Bruce Willis')

	// click on the link 2
	await page.click('#user-link-2')

	// wait some time
	await sleep(100)

	// make sure we loaded the second user's information
	await expect_to_be(page, '2:Samuel Jackson')
})
