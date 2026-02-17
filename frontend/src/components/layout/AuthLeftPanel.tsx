import { LuFileText, LuMic } from 'react-icons/lu';
import { PiBrain } from 'react-icons/pi';

const AuthLeftPanel = () => {
  return (
    <div className="relative p-10 md:p-12 bg-violet-50/50">
      <div className="flex itmes-center gap-3">
        <div className="grid h-15 w-15 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-purple-500 text-white shadow-lg">
          <PiBrain className="text-4xl"/>
        </div>

        <div>
          <div className="text-3xl font-semibold text-slate-800">Neura</div>
          <div className="mt-1 text-sm text-slate-500">Your second brain at a glance</div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-white/55 p-8 ring-1 ring-white/50 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center border-r border-slate-200/70 pr-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-violet-100/70 text-violet-600">
              <LuFileText className="text-2xl" />
            </div>
            <div className="mt-4 text-sm font-medium text-slate-700">Capture Notes</div>
          </div>

          <div className="text-center pl-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-violet-100/70 text-violet-600">
              <LuMic className="text-2xl" />
            </div>
            <div className="mt-4 text-sm font-medium text-slate-700">Record Voice Notes</div>
          </div>
        </div>

        <div className="my-8 h-px bg-slate-200/70"></div>
        <div className="text-center text-sm text-slate-500">Search, organize and find your insights!</div>
        <div className="text-center mt-6 rounded-2xl bg-white/60 px-6 py-4 text-sm text-slate-600 shadow-sm ring-1 ring-white/60">✨ Capture it in 10 seconds! ✨</div> 
      </div>  
    </div>
  )
}

export default AuthLeftPanel