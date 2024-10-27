import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { List } from "flowbite-react"
import { Link } from "react-router-dom"

function BecomeASeller() {
    document.title = "Become a seller - Ecommerce Shopping App"
    return (
        <>
            <div className="text-center">
                <h1 className="font-bold text-2xl mb-10 dark:text-white">Become a Seller</h1>

                <Link to="/seller-registration" className="bg-blue-600 w-fit ml-auto mr-auto text-white rounded p-3">
                    Register Now
                    <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
                </Link>
                <br /><br /><br />
                <Link to="/profile-page" className="bg-blue-600 w-fit ml-auto mr-auto text-white rounded p-3">
                    Profile Page
                    <FontAwesomeIcon className="ml-3 m-auto" icon={faArrowRight} />
                </Link>
            </div>
            <br />
            <section>
                <h1 className="text-2xl dark:text-slate-300">Guidelines :- </h1>
                <br />
                <List>
                    <List.Item>
                        List item one
                        <List ordered nested>
                            <List.Item>{`You might feel like you are being really "organized" o`}</List.Item>
                            <List.Item>Nested navigation in UIs is a bad idea too, keep things as flat as possible.</List.Item>
                            <List.Item>Nesting tons of folders in your source code is also not helpful.</List.Item>
                        </List>
                    </List.Item>
                    <List.Item>
                        List item two
                        <List ordered nested>
                            <List.Item>{`I'm not sure if we'll bother styling more than two levels deep.`}</List.Item>
                            <List.Item>Two is already too much, three is guaranteed to be a bad idea.</List.Item>
                            <List.Item>If you nest four levels deep you belong in prison.</List.Item>
                        </List>
                    </List.Item>
                    <List.Item>
                        List item three
                        <List ordered nested>
                            <List.Item>{`Again please don't nest lists if you want`}</List.Item>
                            <List.Item>Nobody wants to look at this.</List.Item>
                            <List.Item>{`I'm upset that we even have to bother styling this.`}</List.Item>
                        </List>
                    </List.Item>
                </List>
            </section>
        </>
    )
}

export default BecomeASeller
