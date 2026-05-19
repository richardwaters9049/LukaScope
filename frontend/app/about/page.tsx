import Nav from "@/components/ui/nav"

const About = () => {
    return (
        <div className="min-h-screen text-white">
            <Nav />
            <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
                <div className="flex flex-col gap-3">
                    <h1 className="text-5xl font-semibold tracking-wider">LukaScope</h1>
                    <p className="max-w-3xl text-lg text-slate-200">
                        LukaScope supports blood smear review by pairing computer vision with clear,
                        clinician-friendly result summaries.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <section className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <h2 className="text-xl font-semibold">Sample workflow</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Users upload smear images, review model confidence, and inspect
                            explainability views alongside the original sample.
                        </p>
                    </section>
                    <section className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <h2 className="text-xl font-semibold">Clinical context</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Results highlight abnormal morphology indicators while keeping the
                            final interpretation in the hands of qualified professionals.
                        </p>
                    </section>
                    <section className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
                        <h2 className="text-xl font-semibold">Audit trail</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Each result includes sample metadata, model version, cell statistics,
                            and recent history for quick follow-up.
                        </p>
                    </section>
                </div>
            </section>
        </div>
    )
}

export default About
